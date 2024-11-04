from mongoengine import *


class User(Document):
    fname = StringField(required=True)
    lname = StringField(required=True)
    email = StringField(required=True)
    password = StringField(required=True)
    cc_number = StringField()
    cc_number = StringField()

    def __str__(self):
        return self.username
