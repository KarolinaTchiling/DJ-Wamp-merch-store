from flask import request, jsonify
import re
from . import user
from mongoengine import Q
import bcrypt
from ...auth.session import generate_token
from app.models import User
from app.auth.session import (
    get_user_from_token,
    admin_required,
    user_required,
    user_or_admin_required,
    get_referenced_user,
)
from cryptography.fernet import Fernet
from app.main.cart.routes import  sync_user_cart


# card data send in "xxxxxxxxxxxxxxxx-xxxx-xxx" (16 nums, exp(mmyy),cvv), one string
@user.route("/cc", methods=["PATCH"])
@user_required
def add_cc():
    data = request.json
    if not data or "cc_info" not in data:
        return jsonify({"error": "Missing cc_info field"}), 400

    cc_string = data["cc_info"]
    # Validate format: 16 digits, followed by -MMYY-CVV
    pattern = r"^\d{16}-\d{4}-\d{3}$"
    if not re.match(pattern, cc_string):
        return jsonify({"error": "Invalid Credit Card. Expected 'xxxxxxxxxxxxxxxx-mmyy-cvv'"}), 400

    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = User.objects(email=payload["email"]).first()

    try:
        decryption_key = Fernet.generate_key().decode("utf-8")
        cipher = Fernet(decryption_key.encode("utf-8"))

        encrypted_card = cipher.encrypt(cc_string.encode()).decode("utf-8")
        user.cc_info = encrypted_card
        user.decryption_key = decryption_key
        user.save()
        return jsonify({"message": "Card information updated"}), 201
    except Exception as e:
        return jsonify({"error adding credit card to user": str(e)}), 500

@user.route("/cc", methods=["GET"])
@user_required
def get_decoded_cc():
    # Extract the user's token and fetch their information
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = User.objects(email=payload["email"]).first()
    
    if not user or not user.cc_info or not user.decryption_key:
        return jsonify({"error": "Credit card information not found"}), 404

    try:
        # Decrypt the credit card information
        encrypted_card = user.cc_info
        decryption_key = user.decryption_key
        cipher = Fernet(decryption_key.encode("utf-8"))
        decrypted_card = cipher.decrypt(encrypted_card.encode("utf-8")).decode("utf-8")
        
        return jsonify({"cc_info": decrypted_card}), 200
    except Exception as e:
        return jsonify({"error": f"Unable to decode card: {str(e)}"}), 500


@user.route("/users", methods=["GET"])
@admin_required
def get_users():
    try:
        # get query parameters for filtering, sorting, and searching
        fname = request.args.get("fname")
        lname = request.args.get("lname")
        email = request.args.get("email")
        street = request.args.get("street")
        city = request.args.get("city")
        province = request.args.get("province")
        postal_code = request.args.get("postal_code")
        sort_by = request.args.get("sort_by", "name")
        order = request.args.get("order", "asc")

        print(
            f"Query params: \n fname={fname}\n lname={lname} \n email={email} \n street={street} \n city={city} "
            f"\n prov={province} \n postal={postal_code} \n sort={sort_by} \n order={order}"
        )

        # build query
        query = Q()
        if fname:
            query &= Q(fname__icontains=fname)
        if lname:
            query &= Q(lname__icontains=lname)
        if email:
            query &= Q(email__icontains=email)
        if street:
            query &= Q(street__icontains=street)  # OR logic
        if city:
            query &= Q(city__icontains=city)
        if province:
            query &= Q(province__icontains=province)
        if postal_code:
            query &= Q(postal_code__icontains=postal_code)

        users = User.objects(query)
        # sort results
        sort_order = 1 if order == "asc" else -1
        users = users.order_by(f"{'-' if sort_order == -1 else ''}{sort_by}")

        # Synchronize carts for all users
        for user in users:
            sync_user_cart(user)

        users_json = []
        print("formatting users")
        for u in users:
            users_json.append(u.json_formatted())

        return jsonify({"users": users_json}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user.route("/", methods=["GET"])
@user_or_admin_required
def get_user():
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = get_referenced_user(payload)

    # Synchronize the user's cart
    sync_user_cart(user)

    try:
        print("user routes.py: get user passed")
        return jsonify({"user": user.json_formatted()}), 201
    except Exception as e:
        print("user routes.py: get user failed")
        return jsonify({"error getting user data": str(e)}), 500


@user.route("/", methods=["PATCH"])
@user_or_admin_required
def edit_user():
    data = request.json
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = get_referenced_user(payload)

    # Sync cart to remove deleted products
    sync_user_cart(user)

    try:
        for key, value in data.items():
            if hasattr(user, key):
                setattr(user, key, value)
        user.save()

        token = generate_token(data["email"])
        return jsonify({"token": token}), 200
    except Exception as e:
        return jsonify({"error updating user data": str(e)}), 500


@user.route("/address", methods=["PATCH"])
# @user_required
def update_address():
    data = request.json
    if not data:
        return jsonify({
            "error": "No data provided.",
            "rules": {
                "street": "Must include a house/building number and a street name. Example: '123 Main St'.",
                "city": "Must only contain letters and spaces. Example: 'Toronto'.",
                "province": "Must only contain letters and spaces. Example: 'Ontario'.",
                "postal_code": "Must follow the correct format. Examples: 'A1A 1A1' for Canada or '12345' for the USA."
            }
        }), 400

    # Validate required fields
    required_fields = ["street", "city", "province", "postal_code"]
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return jsonify({
            "error": f"Missing required fields: {', '.join(missing_fields)}.",
            "rules": {
                "street": "Must include a house/building number and a street name. Example: '123 Main St'.",
                "city": "Must only contain letters and spaces. Example: 'Toronto'.",
                "province": "Must only contain letters and spaces. Example: 'Ontario'.",
                "postal_code": "Must follow the correct format. Examples: 'A1A 1A1' for Canada or '12345' for the USA."
            }
        }), 400

    # Validate street
    if not re.match(r"^\d+\s[\w\s.,#-]+$", data["street"]):
        return jsonify({
            "error": "Invalid street format.",
            "rules": {
                "street": "Must include a house/building number and a street name. Example: '123 Main St'.",
                "city": "Must only contain letters and spaces. Example: 'Toronto'.",
                "province": "Must only contain letters and spaces. Example: 'Ontario'.",
                "postal_code": "Must follow the correct format. Examples: 'A1A 1A1' for Canada or '12345' for the USA."
            }
        }), 400

    # Validate city (no numbers allowed)
    if not re.match(r"^[a-zA-Z\s]+$", data["city"]):
        return jsonify({
            "error": "Invalid city format. City names cannot contain numbers.",
            "rules": {
                "street": "Must include a house/building number and a street name. Example: '123 Main St'.",
                "city": "Must only contain letters and spaces. Example: 'Toronto'.",
                "province": "Must only contain letters and spaces. Example: 'Ontario'.",
                "postal_code": "Must follow the correct format. Examples: 'A1A 1A1' for Canada or '12345' for the USA."
            }
        }), 400

    # Validate province (no numbers allowed)
    if not re.match(r"^[a-zA-Z\s]+$", data["province"]):
        return jsonify({
            "error": "Invalid province format. Province names cannot contain numbers.",
            "rules": {
                "street": "Must include a house/building number and a street name. Example: '123 Main St'.",
                "city": "Must only contain letters and spaces. Example: 'Toronto'.",
                "province": "Must only contain letters and spaces. Example: 'Ontario'.",
                "postal_code": "Must follow the correct format. Examples: 'A1A 1A1' for Canada or '12345' for the USA."
            }
        }), 400

    # Validate postal code
    postal_code_pattern = r"^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$"
    if not re.match(postal_code_pattern, data["postal_code"]):
        return jsonify({
            "error": "Invalid postal code format.",
            "rules": {
                "street": "Must include a house/building number and a street name. Example: '123 Main St'.",
                "city": "Must only contain letters and spaces. Example: 'Toronto'.",
                "province": "Must only contain letters and spaces. Example: 'Ontario'.",
                "postal_code": "Must follow the correct format. Examples: 'A1A 1A1' for Canada or '12345' for the USA."
            }
        }), 400

    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = User.objects(email=payload["email"]).first()

    try:
        # Update the user's address fields
        user.street = data.get("street", user.street)
        user.city = data.get("city", user.city)
        user.province = data.get("province", user.province)  # Now validated
        user.postal_code = data.get("postal_code", user.postal_code)

        # Save changes
        user.save()
        return jsonify({"message": "Shipping address updated successfully"}), 201
    except Exception as e:
        return jsonify({"error updating shipping address": str(e)}), 500



@user.route("/<user_id>", methods=["PATCH"])
@admin_required
def admin_edit_user(user_id):
    data = request.json
    try:
        u = User.objects.get(id=user_id)
        for key, value in data.items():
            if hasattr(u, key):
                setattr(u, key, value)
        u.save()

        # Sync cart to remove deleted products
        sync_user_cart(u)

        return jsonify({"message": "updated u"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user.route("/pw", methods=["PATCH"])
@user_or_admin_required
def edit_user_pw():
    data = request.json
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = get_referenced_user(payload)
    try:
        password = data["password"].encode("utf-8")  # Retrieve password from JSON data
        # Hash password
        h_password = bcrypt.hashpw(password, bcrypt.gensalt())
        password = h_password.decode("utf-8")
        user.password = password
        user.save()

        return jsonify({"message": "User Password edited"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
