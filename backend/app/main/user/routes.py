from flask import render_template, redirect, url_for, request, jsonify
import datetime
import jwt
from . import user
import bcrypt
from app.models import User, Product
from app.auth.session import (
    get_user_from_token,
    admin_required,
    user_required,
    user_or_admin_required,
)
from cryptography.fernet import Fernet


# card data send in "xxxxxxxxxxxxxxxx-xxxx-xxx" (16 nums, exp(mmyy),cvv), one string
@user.route("/cc", methods=["PATCH"])
@user_required
def add_cc():
    data = request.json
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = User.objects(email=payload["email"]).first()
    try:
        cipher = Fernet(user.decryption_key)
        cc_string = data["card"]
        encrypted_card = cipher.encrypt(cc_string.encode())
        user.update_credit_card(encrypted_card)
        return jsonify({"message": "Card information updated"}), 201
    except Exception as e:
        return jsonify({"error adding credit card to user": str(e)}), 500


@user.route("/cart", methods=["POST"])
@user_required
def add_to_cart():
    data = request.json
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = User.objects(email=payload["email"]).first()
    try:
        product = Product.objects(id=data["product_id"])
        user.cart.append(product)
        user.save()
        return jsonify({"message:": "Added item to user's cart."}), 201
    except Exception as e:
        return jsonify({"error adding item to user's cart": str(e)}), 500


@user.route("/cart", methods=["GET"])
@user_required
def get_cart():
    data = request.json
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    try:
        user = User.objects(email=payload["email"]).first()
        output = []
        for item in user.cart:
            output.append(json_formatted(item))
        return jsonify(output), 201
    except Exception as e:
        return jsonify({"error getting user's cart": str(e)}), 500


@user.route("/cart", methods=["DELETE"])
@user_required
def remove_from_cart():
    data = request.json
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    try:
        user = User.objects(email=payload["email"]).first()
        if data.get("clear_all"):
            for product in user.cart:
                user.cart.remove(product)
        else:
            product = Product.objects(id=data["product_id"])
            user.cart.remove(product)
        user.save()
        return jsonify({"message:": "Removed item from user's cart"}), 201
    except Exception as e:
        return jsonify({"error removing item from user's cart": str(e)}), 500


@user.route("/<user_id>", methods=["GET"])
@user_or_admin_required
def get_user():
    data = request.json
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    try:
        user = User.objects(email=payload["email"]).first()
        if user is None:
            user = User.objects(email=data["user_email"]).first()
        return jsonify(user.json_formatted()), 201
    except Exception as e:
        return jsonify({"error getting user data": str(e)}), 500


@user.route("/<user_id>", methods=["PATCH"])
@user_or_admin_required
def edit_user():
    data = request.json
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    try:
        user = User.objects(email=payload["email"]).first()
        if user is None:
            user = User.objects(email=data["user_email"]).first()

        for key, value in data.items():
            if hasattr(user, key):
                setattr(user, key, value)

        return jsonify({"message": "user info updated."}), 201
    except Exception as e:
        return jsonify({"error updating user data": str(e)}), 500
