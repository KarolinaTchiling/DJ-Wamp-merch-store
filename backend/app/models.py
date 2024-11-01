from mongoengine import *


class User(Document):
    email = StringField(required=True)
    password = StringField(required=True)

    def __str__(self):
        return self.username
