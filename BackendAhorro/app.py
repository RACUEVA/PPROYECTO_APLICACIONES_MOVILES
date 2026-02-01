# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from models_user import db, User 

app = Flask(__name__)
CORS(app) # Habilita la conexión desde React Native 

# Configuración de SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ahorro_facil.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(username=data['email']).first():
        return jsonify({"error": "Correo duplicado"}), 400

    # Guardamos fullName del móvil en el campo fullname de la base de datos
    new_user = User(
        username=data['email'], 
        password=data['password'], 
        fullname=data.get('fullName'), 
        role='User' 
    )
    db.session.add(new_user)
    db.session.commit() # Crea el registro en el archivo .db 
    return jsonify({"message": "Registro exitoso"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['email'], password=data['password']).first()
    if user:
        # Devolvemos el nombre real para el saludo en el Panel de Ahorro
        return jsonify({
            "message": "Login exitoso", 
            "user": {
                "name": user.fullname, 
                "email": user.username
            }
        }), 200
    return jsonify({"error": "Datos incorrectos"}), 401

@app.route('/check-email', methods=['POST'])
def check_email():
    data = request.json
    # Busca si el correo ya existe en la base de datos 
    user = User.query.filter_by(username=data.get('email')).first()
    return jsonify({"exists": user is not None}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Genera la tabla automáticamente si no existe 
    app.run(debug=True, host='0.0.0.0', port=5000)