from flask import Flask, request, jsonify
from flask_cors import CORS
import MySQLdb
import bcrypt

# Flask App
app = Flask(__name__)
CORS(app)

# Database Connection
db = MySQLdb.connect(
    host="localhost",
    user="root",
    passwd="Kkunche@000",
    db="myhome"
)

# =========================
# Home Route
# =========================
@app.route('/')
def home():
    return "MyHome Backend Running"


# =========================
# Register API
# =========================
@app.route('/register', methods=['POST'])
def register():

    data = request.json

    name = data['name']
    email = data['email']
    password = data['password']

    cursor = db.cursor()

    # Check Existing Email
    check_query = "SELECT * FROM users WHERE email=%s"

    cursor.execute(check_query, (email,))

    existing_user = cursor.fetchone()

    if existing_user:
        return jsonify({
            "message": "Email already exists"
        })

    # Hash Password
    hashed_password = bcrypt.hashpw(
        password.encode('utf-8'),
        bcrypt.gensalt()
    )

    # Convert bytes to string before storing
    hashed_password = hashed_password.decode('utf-8')

    # Insert User
    query = """
    INSERT INTO users(name,email,password)
    VALUES(%s,%s,%s)
    """

    cursor.execute(query, (
        name,
        email,
        hashed_password
    ))

    db.commit()

    return jsonify({
        "message": "User Registered Successfully"
    })


# =========================
# Login API
# =========================
@app.route('/login', methods=['POST'])
def login():

    data = request.json

    email = data['email']
    password = data['password']

    cursor = db.cursor()

    query = "SELECT * FROM users WHERE email=%s"

    cursor.execute(query, (email,))

    user = cursor.fetchone()

    if user:

        stored_password = user[3]

        # Convert stored password string back to bytes
        stored_password = stored_password.encode('utf-8')

        if bcrypt.checkpw(
            password.encode('utf-8'),
            stored_password
        ):

            return jsonify({
                "message": "Login Successful"
            })

    return jsonify({
        "message": "Invalid Email or Password"
    })

# =========================
# Savings API
# =========================
@app.route('/add-savings', methods=['POST'])
def add_savings():

    try:

        data = request.json

        user_id = int(data['user_id'])
        income = float(data['income'])
        expenses = float(data['expenses'])

        total_savings = income - expenses

        cursor = db.cursor()

        query = """
        INSERT INTO savings(
            user_id,
            income,
            expenses,
            savings
        )
        VALUES(%s,%s,%s,%s)
        """

        cursor.execute(query, (
            user_id,
            income,
            expenses,
            total_savings
        ))

        db.commit()

        return jsonify({
            "message": "Savings Added Successfully",
            "total_savings": total_savings
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        })

# =========================
# Loan EMI Calculator API
# =========================
@app.route('/calculate-loan', methods=['POST'])
def calculate_loan():

    data = request.json

    user_id = data['user_id']
    loan_amount = float(data['loan_amount'])
    interest_rate = float(data['interest_rate'])
    tenure = int(data['tenure'])

    monthly_rate = (interest_rate / 12) / 100
    months = tenure * 12

    emi = (
        loan_amount * monthly_rate *
        (1 + monthly_rate) ** months
    ) / (
        ((1 + monthly_rate) ** months) - 1
    )

    cursor = db.cursor()

    query = """
    INSERT INTO loans(
        user_id,
        loan_amount,
        interest_rate,
        tenure,
        emi
    )
    VALUES(%s,%s,%s,%s,%s)
    """

    cursor.execute(query, (
        user_id,
        loan_amount,
        interest_rate,
        tenure,
        emi
    ))

    db.commit()

    return jsonify({
        "message": "Loan Calculated Successfully",
        "EMI": round(emi, 2)
    })


# =========================
# Run Flask App
# =========================
# =========================
# Property Recommendation API
# =========================
@app.route('/get-properties', methods=['GET'])
def get_properties():

    cursor = db.cursor()

    query = "SELECT * FROM properties"

    cursor.execute(query)

    properties = cursor.fetchall()

    property_list = []

    for property in properties:

        property_data = {
            "id": property[0],
            "name": property[1],
            "location": property[2],
            "price": property[3]
        }

        property_list.append(property_data)

    return jsonify(property_list)

# =========================
# Interested Buyer API
# =========================
@app.route('/interested', methods=['POST'])
def interested():

    data = request.json

    user_name = data['user_name']
    email = data['email']
    property_name = data['property_name']

    cursor = db.cursor()

    query = """
    INSERT INTO interested_buyers(
        user_name,
        email,
        property_name
    )
    VALUES(%s,%s,%s)
    """

    cursor.execute(query, (
        user_name,
        email,
        property_name
    ))

    db.commit()

    return jsonify({
        "message": "Admin Will Contact You Soon"
    })

# =========================
# Admin Buyers API
# =========================
@app.route('/admin-buyers', methods=['GET'])
def admin_buyers():

    cursor = db.cursor()

    query = "SELECT * FROM interested_buyers"

    cursor.execute(query)

    buyers = cursor.fetchall()

    buyer_list = []

    for buyer in buyers:

        buyer_data = {
            "id": buyer[0],
            "user_name": buyer[1],
            "email": buyer[2],
            "property_name": buyer[3]
        }

        buyer_list.append(buyer_data)

    return jsonify(buyer_list)


if __name__ == '__main__':
    app.run(debug=True)

