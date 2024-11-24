import pytest
import mongomock
from mongomock import MongoClient
from flask import json
from mongoengine import connect, disconnect
from mongoengine import Document, StringField
from app import create_app
from env import DB_URI
from ..models import *


@pytest.fixture(scope="module")
def test_client():
    app = create_app(True)

    with app.test_client() as client:
        yield client


def test_create_user(test_client):
    user_data = {
        "fname": "wampington",
        "lname": "Mcsus",
        "email": "test_create@domain.com",
        "password": "wamp123",
        "street": "8 wamp avenue",
        "city": "brampton",
        "province": "wamplandia",
        "postal": "W1W1W1",
        "card": "1234123412341234-1212-123",
    }
    response = test_client.post("/signup", json=user_data)
    assert response.status_code == 201
    user = User.objects(email=user_data["email"]).first()
    assert user != None


def test_login(test_client):
    user_data = {
        "fname": "wampington",
        "lname": "Mcsus",
        "email": "testlogin@domain.com",
        "password": "wamp123",
        "street": "8 wamp avenue",
        "city": "brampton",
        "province": "wamplandia",
        "postal": "W1W1W1",
        "card": "1234123412341234-1212-123",
    }
    response = test_client.post("/signup", json=user_data)
    assert response.status_code == 201
    user = User.objects(email=user_data["email"]).first()
    assert user != None

    login_data = {
        "email": "testlogin@domain.com",
        "password": "wamp123",
    }
    response = test_client.post("/login", json=login_data)
    assert response.status_code == 200
    jwt = response.json["token"]
    assert jwt != None


def test_patch_user(test_client):
    user_data = {
        "fname": "wampington",
        "lname": "Mcsus",
        "email": "testingpatching@domain.com",
        "password": "wamp123",
        "street": "8 wamp avenue",
        "city": "brampton",
        "province": "wamplandia",
        "postal": "W1W1W1",
        "card": "1234123412341234-1212-123",
    }
    response = test_client.post("/signup", json=user_data)

    login_data = {
        "email": "testingpatching@domain.com",
        "password": "wamp123",
    }
    response = test_client.post("/login", json=login_data)
    jwt = response.json["token"]
    headers = {"Authorization": f"Bearer {jwt}"}
    changed_json = {"fname": "wampette", "lname": "LeSus"}
    response = test_client.patch("/user/", json=changed_json, headers=headers)
    assert response.status_code == 201
    user = User.objects(email=login_data["email"]).first()

    assert user.fname == changed_json["fname"]
    assert user.lname == changed_json["lname"]


def test_patch_card(test_client):
    user_data = {
        "fname": "wampington",
        "lname": "Mcsus",
        "email": "testingcardpatch@domain.com",
        "password": "wamp123",
        "street": "8 wamp avenue",
        "city": "brampton",
        "province": "wamplandia",
        "postal": "W1W1W1",
        "card": "1234123412341234-1212-123",
    }
    response = test_client.post("/signup", json=user_data)
    assert response.status_code == 201
    user = User.objects(email=user_data["email"]).first()
    assert user != None

    login_data = {
        "email": "testingcardpatch@domain.com",
        "password": "wamp123",
    }
    response = test_client.post("/login", json=login_data)
    jwt = response.json["token"]
    headers = {"Authorization": f"Bearer {jwt}"}
    patch_json = {"card": "4321432143214321-4343-432"}
    response = test_client.patch("/user/cc", json=patch_json, headers=headers)
    assert response.status_code == 201
    user = User.objects(email=user_data["email"]).first()
    assert patch_json["card"] == user.get_credit_card_string()
