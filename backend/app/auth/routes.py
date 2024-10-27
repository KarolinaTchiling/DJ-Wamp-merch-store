from flask import render_template, redirect, url_for
from . import auth


@auth.route("/login")
def login():
    return "Login"


@auth.route("/signup")
def signup():
    return "Signup"


@auth.route("/signup", methods=["POST"])
def signup_post():
    # validate user
    email = request.form.get("email")
    name = request.form.get("name")
    password = request.form.get("password")
    # check if user already exists
    # make new user object
    # add user to db
    return redirect(url_for("auth.login"))


@auth.route("/logout")
def logout():
    return "Logout"
