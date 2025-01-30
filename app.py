from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow import fields, ValidationError
import re
from datetime import date, timedelta
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:password@localhost/e_commerce_project'
db = SQLAlchemy(app)
ma = Marshmallow(app)

# Schemas

class CustomerSchema(ma.Schema):
    name = fields.String(required=True)
    email = fields.String(required=True)
    phone = fields.String(required=True)

    class Meta:
        fields = ("name", "email", "phone", "id")

customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)

class CustomerAccountSchema(ma.Schema):
    username = fields.String(required=True)
    password = fields.String(required=True)
    customer_id = fields.Integer(required=True)

    class Meta:
        fields = ("username", "password", "customer_id")

customer_account_schema = CustomerAccountSchema()
customer_accounts_schema = CustomerAccountSchema(many=True)


class Customer(db.Model):
    __tablename__ = 'Customers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable = False)
    email = db.Column(db.String(320), unique=True)
    phone = db.Column(db.String(15), unique=True)
    account = db.relationship('CustomerAccount', backref='customer', uselist=False, cascade='all, delete-orphan')

class CustomerAccount(db.Model):
    __tablename__ = 'CustomerAccounts'
    customer_id = db.Column(db.Integer, db.ForeignKey('Customers.id'), primary_key=True)
    username = db.Column(db.String(255), nullable = False)
    password = db.Column(db.String(255), nullable = False)

class OrderSchema(ma.Schema):
    customer_id = fields.Integer(required=True)
    shipping_date = fields.Date(required=True)
    arrival_date = fields.Date(required=True)
    order_status = fields.String(required=True)

    class Meta:
        fields = ("customer_id", "product_id", "quantity", "shipping_date", "arrival_date", "order_status", "id")

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)

class OrderProductSchema(ma.Schema):
    order_id = fields.Integer(required=True)
    products_id = fields.Integer(required=True)
    quantity = fields.Integer(required=True)

order_product_schema = OrderProductSchema()
order_products_schema = OrderProductSchema(many=True)


order_product = db.Table("OrderProduct", 
db.Column("order_id", db.Integer, db.ForeignKey("Orders.id"), primary_key=True), 
db.Column("product_id", db.Integer, db.ForeignKey("Products.id"), primary_key=True),
db.Column("quantity", db.Integer))

class Order(db.Model):
    __tablename__ = "Orders"
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('Customers.id'), nullable = False)
    shipping_date = db.Column(db.Date, nullable = False)
    arrival_date = db.Column(db.Date, nullable = False)
    order_status = db.Column(db.String(20), nullable = False)
    products = db.relationship("Product", secondary=order_product, backref=db.backref("orders_products"))
    

class ProductSchema(ma.Schema):
    name = fields.String(required=True)
    price = fields.String(required=True)
    stock = fields.Integer(required=True)

    class Meta:
        fields = ("name", "price", "stock", "id")

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

class Product(db.Model):
    __tablename__ = "Products"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable = False)
    price = db.Column(db.String(100), nullable = False)
    stock = db.Column(db.Integer, nullable = False)
    orders = db.relationship("Order", secondary=order_product, backref=db.backref("products_orders"))

# Customers and Customer Accounts

@app.route('/customers/<int:id>', methods=['GET'])
def get_customer(id):
    customer = Customer.query.get_or_404(id)
    if not customer:
        return jsonify({"message": "Customer account not found."}), 404
    return customer_schema.jsonify(customer)

@app.route('/customers', methods=['GET'])
def get_customers():
    customer = Customer.query.all()
    if not customer:
        return jsonify({"message": "Customers not found."}), 404
    return customers_schema.jsonify(customer)

@app.route('/customeraccounts/<int:id>', methods=['GET'])
def get_customer_account(id):
    account = CustomerAccount.query.get_or_404(id)
    return customer_account_schema.jsonify(account)

@app.route('/orders', methods=['GET'])
def get_orders():
    customer_id = request.args.get('customer_id')
    try:
        orders = Order.query.filter_by(customer_id=customer_id).all()
        return orders_schema.jsonify(orders)
    except Exception as e:
        return jsonify({'error': e}), 500


def validate_email(email):
    valid_email = re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email)
    return valid_email

def validate_phone_number(phone):
    valid_phone = re.match(r"[(]?\d{3}[)]?[\s-]?\d{3}[\s-]?\d{4}", phone)
    return valid_phone

def validate_username(username):
    if len(username) < 5 or len(username) > 30:
        return False
    return True

def validate_name(name):
    if len(name) < 5 or len(name) > 50:
        return False
    return True

def validate_password(password):
    if len(password) < 8:
        return False
    capital_pattern = re.compile(r'[A-Z]')
    lowercase_pattern = re.compile(r'[a-z]')
    number_pattern = re.compile(r'\d')
    special_pattern = re.compile(r'[!@#$%^&*(),.?":{}|<>]')
    count = 0
    if capital_pattern.search(password):
        count += 1
    if lowercase_pattern.search(password):
        count += 1
    if number_pattern.search(password):
        count += 1
    if special_pattern.search(password):
        count += 1

    return count >= 3

@app.route('/customers', methods=['POST'])
def add_customer():
    try:
        customer_data = {'name':request.json['name'], 'email':request.json['email'], 'phone':request.json['phone']}
        valid_name = validate_name(customer_data['name'])
        if not valid_name:
            raise ValidationError("Name invalid.")
        email_valid = validate_email(customer_data['email'])
        if email_valid == None:
            raise ValidationError("Email invalid.")
        phone_valid = validate_phone_number(customer_data['phone'])
        if phone_valid == None:
            raise ValidationError("Phone number invalid.")

    except ValidationError as e:
        return jsonify(e.messages), 400
    
    new_customer = Customer(name=customer_data['name'], email=customer_data['email'], phone=customer_data['phone'])
    db.session.add(new_customer)
    db.session.flush()

    try:
        account_data = {'username':request.json['username'], 'password':request.json['password']}
        username_valid = validate_username(account_data['username'])
        if not username_valid:
            raise ValidationError("Username invalid.")
        pw_valid = validate_password(account_data['password'])
        if not pw_valid:
            raise ValidationError("Password invalid.")
    except ValidationError as e:
        return jsonify(e.messages), 400
    new_customer_account = CustomerAccount(username=account_data['username'], password=account_data['password'], customer_id=new_customer.id)
    db.session.add(new_customer_account)

    db.session.commit()
    return jsonify({"message": "New customer added successfully."}), 201

@app.route('/customers/<int:id>', methods=['PUT'])
def update_customer(id):
    customer = Customer.query.get_or_404(id)
    try:
        customer_data = customer_schema.load(request.json)
        email_valid = validate_email(customer_data['email'])
        if email_valid == None:
            raise ValidationError("Email invalid.")
        phone_valid = validate_phone_number(customer_data['phone'])
        if phone_valid == None:
            raise ValidationError("Phone number invalid.")
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    customer.name = customer_data["name"]
    customer.email = customer_data["email"]
    customer.phone = customer_data["phone"]
    db.session.commit()
    return jsonify({"message": "Customer details updated successfully."})

@app.route('/customeraccounts/<int:id>', methods=['PUT'])
def update_customer_account(id):
    customer_account = CustomerAccount.query.get_or_404(id)
    try:
        account_data = customer_account_schema.load(request.json)
        username_valid = validate_username(account_data['username'])
        if username_valid == None:
            raise ValidationError("Username invalid.")
        password_valid = validate_password(account_data['password'])
        if not password_valid:
            raise ValidationError("Password invalid.")
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    customer_account.username = account_data["username"]
    customer_account.password = account_data["password"]
    db.session.commit()
    return jsonify({"message": "Customer account details updated successfully."})


@app.route("/customers/<int:id>", methods=['DELETE'])
def delete_customer(id):
    customer = Customer.query.get_or_404(id)
    if not customer:
        return jsonify({"message": "Customer not found."}), 404
    db.session.delete(customer)
    db.session.commit()
    return jsonify({'message': "Customer removed successfully."}), 200

@app.route("/customeraccounts/<int:id>", methods=['DELETE'])
def delete_customer_account(id):
    customer_account = CustomerAccount.query.get_or_404(id)
    if not customer_account:
        return jsonify({"message": "Account not found."}), 404
    db.session.delete(customer_account)
    db.session.commit()
    return jsonify({'message': "Account removed successfully."}), 200


# Products

@app.route("/products", methods=['GET'])
def list_products():
    products = Product.query.all()
    if not products:
        return jsonify({"message": "No products found."}), 404
    return products_schema.jsonify(products)

@app.route("/products/<int:id>", methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    if not product:
        return jsonify({"message": "Product not found."}), 404
    return product_schema.jsonify(product)

def validate_price(price):
    valid_price = re.match(r"^\$[0-9]+\.[0-9]{2}", price)
    return valid_price

@app.route("/products", methods=['POST'])
def add_product():
    try:
        product_data = {'name':request.json['name'], 'price':request.json['price'], 'stock':request.json['stock']}
        valid_name = validate_name(product_data['name'])
        if not valid_name:
            raise ValidationError("Name invalid.")
        price_valid = validate_price(product_data['price'])
        if price_valid == None:
            raise ValidationError("Price invalid.")
        stock_valid = isinstance(product_data['stock'], int)
        if not stock_valid:
            raise ValidationError("Stock number invalid.")

    except ValidationError as e:
        return jsonify(e.messages), 400
    
    new_product = Product(name=product_data['name'], price=product_data['price'], stock=product_data['stock'])
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product added successfully."})

@app.route("/products/<int:id>", methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    try:
        product_data = product_schema.load(request.json)
        name_valid = validate_name(product_data['name'])
        if name_valid == None:
            raise ValidationError("Product name invalid.")
        price_valid = validate_price(product_data['price'])
        if not price_valid:
            raise ValidationError("Price invalid.")
        stock_valid = isinstance(product_data['stock'], int)
        if not stock_valid:
            raise ValidationError("Stock number invalid.")
        
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    product.name = product_data["name"]
    product.price = product_data["price"]
    product.stock = product_data["stock"]
    db.session.commit()
    return jsonify({"message": "Product details updated successfully."})


@app.route("/products/<int:id>", methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    if not product:
        return jsonify({"message": "Product not found."}), 404
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': "Product removed successfully."}), 200

# Orders

@app.route("/orders", methods=['POST'])
def place_order():
    order_data = request.get_json()
    try:
        shipping_date = date.today()
        arrival_date = shipping_date + timedelta(days=5)
        order_status = 'shipping'
        new_order = Order(customer_id=order_data['customer_id'], shipping_date=shipping_date, \
        arrival_date=arrival_date, order_status=order_status)
        db.session.add(new_order)
        db.session.commit()
        for item in order_data["items"]:
            current_product = Product.query.get_or_404(item["product_id"])
            if item["quantity"] > current_product.stock:
                return jsonify({"message": "Not enough stock for that item."})
            db.session.execute(order_product.insert().values(
                order_id = new_order.id,
                product_id = item["product_id"],
                quantity = item["quantity"]
                ))
            current_product.stock -= item["quantity"]
            db.session.add(current_product)
            db.session.commit()
        return jsonify({"message": "Order added successfully."}), 200
    

    except ValidationError as e:
        return jsonify(e.messages), 400

@app.route("/orders/<int:id>", methods=["GET"])
def get_order_details(id):
    order = Order.query.get_or_404(id)
    if not order:
        return jsonify({"message": "Order not found."}), 404
    return order_schema.jsonify(order)

@app.route("/products/review-stock/<int:id>", methods=["GET"])
def review_stock(id):
    product = Product.query.get_or_404(id)
    if not product:
        return jsonify({"message": "Product not found."}), 404
    if product.stock <= 5:
        return jsonify({"message": f"Stock: {product.stock}\nMust be restocked."})
    return jsonify({"message": f"Stock: {product.stock}\nStock OK for now."})


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)