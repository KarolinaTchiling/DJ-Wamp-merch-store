from flask import render_template, redirect, url_for, request, jsonify
import datetime
import jwt
from . import sale
import bcrypt
from app.models import Product, Sale
from mongoengine import Q
from ...auth.session import (
    admin_required,
    get_user_from_token,
    get_referenced_user,
    user_or_admin_required,
)


@sale.route("/history", methods=["GET"])
@admin_required
def get_sales():
    try:
        # get query parameters for filtering, sorting, and searching
        date = request.args.get("date")
        user = request.args.get("user_id")
        product = request.args.get("product_id")
        total_price = request.args.get("total_price")
        sort_by = request.args.get("sort_by", "name")
        order = request.args.get("order", "asc")
        # build query
        query = Q()
        if date:
            query &= Q(date__date=date)
        if user:
            query &= Q(user=user)
        if total_price:
            query &= Q(total_price=total_price)
        if product:
            query &= Q(purchases__product_name=product)

        # products = Product.objects(query)
        sales = Sale.objects(query)
        print(sales)
        # sort results
        sort_order = 1 if order == "asc" else -1
        sales = sales.order_by(f"{'-' if sort_order == -1 else ''}{sort_by}")

        sales_json = []
        print("formatting sales")
        for sale in sales:
            sales_json.append(sale.json_formatted())

        return jsonify({"sales": sales_json}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@sale.route("/<sale_id>", methods=["GET"])
@admin_required
def get_sale(sale_id):
    try:
        sale = Sale.objects.get(id=sale_id)
        return jsonify(sale.json_formatted()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@sale.route("/", methods=["POST"])
@user_or_admin_required
def make_sale():
    token = request.headers.get("Authorization")
    payload = get_user_from_token(token)
    user = get_referenced_user(payload)
    try:
        sale = Sale(
            date=datetime.date.today(),
            user=user,
            total_price=user.cart_total,
            purchases=user.cart_items,
            approved=True,
        )
        sale.save()
        # clear a user's cart after a order

        return jsonify({"message": "sale recorded"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
