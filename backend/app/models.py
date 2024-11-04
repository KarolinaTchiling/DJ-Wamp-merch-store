from mongoengine import *


class User(Document):
    fname = StringField(required=True)
    lname = StringField(required=True)
    email = StringField(required=True)
    password = StringField(required=True)
    address = ReferenceField(address, required=False)
    # stores the number, expiry, and cvv, one string because I dont' want to ecnrypt and decrypt 3 diff things lol
    cc_info = BinaryField(required=True)
    # credit card decription key, store somewhere safe in the final version
    decryption_key = BinaryField(required=True)
    purchases = ListField(ReferenceField(Purchase))

    def update_credit_card(self, new_cc):
        self.cc_info = new_cc

    def __str__(self):
        return self.username


class Address(Document):
    street = StringField(required=True)
    city = StringField(required=True)
    province = StringField(required=True)
    postal_code = StringField(required=True)

    def __str__(self):
        return f"{self.street}, {self.city},{self.province},{self.postal_code}"


class Admin(Document):
    username = StringField(required=True)
    password = StringField(required=True)


class Product(Document):
    name = StringField(required=True)
    category = StringField()
    brand = StringField()
    album = StringField()    
    price = FloatField()

    pass


class Purchase(Document):
    pass
