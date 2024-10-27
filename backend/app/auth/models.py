from . import db
from flask_pymongo import pymongo
from flask import current_app
from mongoengine import Document, StringField, IntField, connect


class User(Document):
    username = StringField(required=True, unique=True)
    email = StringField(required=True, unique=True)
    password = StringF

    # def save_to_db(self):
    # mongo.db.users.insert_one({
    #'username': self.username,
    #'email':  self.email,
    #'password': self.password
    # })

    @staticmethod
    def find_by_username(username):
        return mongo.db.users.find_one({"username": username})
