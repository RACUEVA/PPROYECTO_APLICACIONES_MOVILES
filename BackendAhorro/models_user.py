# models_user.py
from flask_sqlalchemy import SQLAlchemy

# Definimos la instancia de SQLAlchemy aquí para evitar importaciones circulares
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    # El username almacena el correo electrónico
    username = db.Column(db.String(80), unique=True, nullable=False) 
    password = db.Column(db.String(120), nullable=False)
    # Nuevo campo para el nombre real que capturamos en el móvil
    fullname = db.Column(db.String(100), nullable=True) 
    # Rol por defecto 'User' según los requisitos
    role = db.Column(db.String(20), default='User', nullable=False)