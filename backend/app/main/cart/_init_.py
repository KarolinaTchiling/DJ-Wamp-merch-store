from flask import Blueprint

cart = Blueprint('cart', __name__, url_preefix='/cart')

from . import routes