from flask import render_template, redirect, url_for, request, jsonify
import datetime
import jwt
from . import user
import bcrypt
from app.models import User, Product, json_formatted
from app.auth.session import get_user_from_token, admin_required
from cryptography.fernet import Fernet


# card data send in "xxxxxxxxxxxxxxxx-xxxx-xxx" (16 nums, exp(mmyy),cvv), one string
@user.route("/cc", methods=["PATCH"])
def add_cc():
    data = request.json
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "NO SESSION TOKEN"}), 401
    payload = get_user_from_token(token)
    if not payload:
        return jsonify({"error": "INVALID SESSION TOKEN"}), 401

    try:
        user = User.objects(email=payload["email"]).first()
        cipher = Fernet(user.decryption_key)
        cc_string = data["card"]
        encrypted_card = cipher.encrypt(cc_string.encode())
        user.update_credit_card(encrypted_card)
        return jsonify({"message": "Card information updated"}), 201
    except Exception as e:
        return jsonify({"error adding credit card to user": str(e)}), 500

@user.route("/cart", methods=["POST"])
def add_cc():
    data = request.json
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "NO SESSION TOKEN"}), 401
    payload = get_user_from_token(token)
    if not payload:
        return jsonify({"error": "INVALID SESSION TOKEN"}), 401

    try:
        user = User.objects(email=payload["email"]).first()
        product = Product.objects(id=data['product_id'])
        return jsonify({"message:":"Added item to user's cart."}), 201
    except Exception as e:
        return jsonify({"error adding item to user's cart": str(e)}), 500

@user.route("/cart", methods=["GET"])
def add_cc():
    data = request.json
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "NO SESSION TOKEN"}), 401
    payload = get_user_from_token(token)
    if not payload:
        return jsonify({"error": "INVALID SESSION TOKEN"}), 401

    try:
        user = User.objects(email=payload["email"]).first()
        output = []
        for item in user.cart:
            output.append(json_formatted(item))
        return jsonify(output), 201
    except Exception as e:
        return jsonify({"error getting user's cart": str(e)}), 500

@user.route("/cart", methods=["DELETE"])
def add_cc():
    data = request.json
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "NO SESSION TOKEN"}), 401
    payload = get_user_from_token(token)
    if not payload:
        return jsonify({"error": "INVALID SESSION TOKEN"}), 401

    try:
        user = User.objects(email=payload["email"]).first()
        product = Product.objects(id=data['product_id'])
        user.cart.remove(product)
        return jsonify({"message:":"Removed item from user's cart"}), 201
    except Exception as e:
        return jsonify({"error removing item from user's cart": str(e)}), 500

@user.route("/<user_id>", methods=["GET"])
@admin_required
def add_cc():
    data = request.json
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "NO SESSION TOKEN"}), 401
    payload = get_user_from_token(token)
    if not payload:
        return jsonify({"error": "INVALID SESSION TOKEN"}), 401

    try:
        user = User.objects(email=payload["email"]).first()
        product = Product.objects(id=data['product_id'])
        user.cart.remove(product)
        return jsonify({"message:":"Removed item from user's cart"}), 201
    except Exception as e:
        return jsonify({"error removing item from user's cart": str(e)}), 500
