from flask import render_template, redirect, url_for, request, jsonify
import datetime
import jwt
import bcrypt
from app.models import Product
from mongoengine import Q

@catalog_bp.route('/products', methods=['GET'])
def get_products():
    try:
        # get query parameters for filtering, sorting, and searching
        category = request.args.get('category')
        brand = request.args.get('brand')
        album = request.args.get('album')
        name = request.args.get('name')
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        sort_by = request.args.get('sort_by', 'name')
        order = request.args.get('order', 'asc')

        # build query
        query = Q()
        if category:
            query &= Q(category__icontains=category)
        if brand:
            query &= Q(brand__icontains=brand)
        if album:
            query &= Q(album__icontains=album)
        if name:
            query &= Q(name__icontains=name)
        if min_price:
            query &= Q(price__gte=float(min_price))
        if max_price:
            query &= Q(price__lte=float(max_price))

        products = Product.objects(query)
        #sort results
        sort_order = 1 if order == 'asc' else -1
        products = products.order_by(f"{'-' if sort_order == -1 else ''}{sort_by}")

        products_json = [{
            'id': str(product.id),  # Convert ObjectId to string
            'name': product.name,
            'category': product.category,
            'brand': product.brand,
            'album': product.album,
            'price': product.price
        } for product in products]
        return jsonify({"products": products_json}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
