from flask import jsonify, request


from app.auth.session import (
    get_user_from_token,
    get_referenced_user,
    user_or_admin_required,
)
from app.models import CartItem, Product

from mongoengine import DoesNotExist
from . import cart


@cart.route("/", methods=["GET"])
@user_or_admin_required
def get_cart():
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    # get user from token
    user = get_referenced_user(payload)

    # Initialize the cart items and the updated cart list
    cart_items = []
    updated_cart_items = []  # Ensure this is defined before usage

    for item in user.cart_items:
        try:
            # Get the product and ensure it's not deleted
            product = Product.objects.get(id=item.product_id.id, is_deleted=False)
            
            # Add valid cart item to the response and updated cart
            cart_items.append(
                {
                    "product_id": str(product.id),
                    "name": product.name,
                    "price": product.price,
                    "total_price": product.price * item.quantity,
                    "quantity": item.quantity,
                    "image_url": product.image_url,
                }
            )
            updated_cart_items.append(item)
        except Product.DoesNotExist:
            # Skip items with deleted products
            continue

    # Recalculate the cart total
    cart_total = sum(item["total_price"] for item in cart_items)

    # Update the user's cart and cart_total if any changes occurred
    if len(updated_cart_items) != len(user.cart_items) or user.cart_total != cart_total:
        user.update(set__cart_items=updated_cart_items, set__cart_total=cart_total)
        user.reload()  # Reload user to reflect the updated cart and total

    return jsonify({"items": cart_items, "cart_total": cart_total}), 200


@cart.route("/", methods=["POST"])
@user_or_admin_required
def add_to_cart():
    data = request.json
    token = request.headers.get("Authorization")
    product_id = data["product_id"]
    quantity = data["quantity"]

    payload = get_user_from_token(token)
    user = get_referenced_user(payload)

    # fetch the product
    try:
        product = Product.objects.get(id=product_id)
    except DoesNotExist:
        return jsonify({"error": "Product not found"}), 404

    # check if product is in user's cart
    for item in user.cart_items:
        if str(item.product_id.id) == product_id:
            item.quantity += quantity
            user.update_cart_total()
            return jsonify(
                {
                    "message": "Product quantity updated",
                    "total": user.cart_total,
                }
            ), 200

    # otherwise create new cart item and add to user cart
    new_item = CartItem(product_id=product, quantity=quantity)

    user.cart_items.append(new_item)

    user.update_cart_total()
    return jsonify(
        {
            "message": "Product added to cart",
            "total": user.cart_total,
        }
    ), 201


# shouldn't require user
@cart.route("/<product_id>", methods=["PATCH"])
@user_or_admin_required
def edit_cart_item_quantity(product_id):
    data = request.json
    token = request.headers.get("Authorization")
    new_quantity = data["quantity"]
    print(f"product_id {product_id}")
    payload = get_user_from_token(token)

    if new_quantity < 0:
        return jsonify({"error": "Quantity cannot be less than 0"})

    user = get_referenced_user(payload)

    try:
        for item in user.cart_items:
            if str(item.product_id.id) == product_id:
                item.quantity = new_quantity
                # if new_quantity == 0:
                # user.cart_items = [
                # item for item in user.cart_items if str(item.product_id.id) != product_id
                # ]
                user.update_cart_total()
                user.save()
                return jsonify({"message": "Product quantity updated"}), 200
        return jsonify({"error editing item quantity": "item not in cart"}), 500
    except Exception as e:
        return jsonify({"error editing cart item quantity": str(e)}), 500


# shoudn't require user
@cart.route("/<product_id>", methods=["DELETE"])
@user_or_admin_required
def remove_cart_item(product_id):
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = get_referenced_user(payload)

    try:
        user.cart_items = [
            item for item in user.cart_items if str(item.product_id.id) != product_id
        ]
        user.update_cart_total()
        user.save()
        return jsonify({"message": "Product removed successfully"}), 200
    except Exception as e:
        return jsonify({"error removing item from cart": str(e)}), 500


@cart.route("/", methods=["DELETE"])
@user_or_admin_required
def clear_cart():
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = get_referenced_user(payload)

    user.cart_items = []
    user.update_cart_total()
    return jsonify({"message": "Cleared cart successfully"}), 200
