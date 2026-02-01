# AhorroFácil – Gestor Inteligente de Finanzas Personales 💰
Este proyecto es una aplicación multiplataforma desarrollada en React Native (Frontend) y Flask (Backend), diseñada para ayudar a los usuarios a controlar su presupuesto mensual mediante una arquitectura de datos centralizada.

# Estructura del Proyecto 📂

Para garantizar la integridad y sincronización de los datos, el proyecto se organiza de la siguiente manera:

> **Backend (PROYECTO/): Fuente principal de datos remota..**

*app.py*: Servidor Flask que gestiona la API y la lógica de autenticación.

*models_user.py*: Definición de la base de datos (Usuarios y Roles).

*ahorro_facil.db*: Base de datos SQLite persistente.

*.env*: Variables de entorno para configuración sensible.


> ** Frontend (AhorroFacilMobile/): **

*App.tsx*: Interfaz de usuario con lógica de registro, login y vista protegida.



## Configuración del Entorno (.env)
En la raíz de la carpeta PROYECTO/, se debe configurar el archivo .env con los siguientes parámetros:

Fragmento de código
> DB_HOST=localhost
DB_PORT=5000
DB_NAME=ahorro_facil.db
SECRET_KEY=clave_secreta_para_sesiones




> **🛠️ Instalación y Ejecución**
Sigue estos pasos en orden para asegurar la comunicación entre la App y el Servidor:

1. Levantar el Backend (Servidor Remoto)
Navega a la carpeta: cd PROYECTO.

* Instala las dependencias: pip install -r requirements.txt.

* Inicia el servidor: python app.py.

* Nota: El servidor correrá en http://127.0.0.1:5000.

2. Iniciar el Frontend (App Móvil)
* Abre una nueva terminal y navega a: cd ahorroFacilMobile.

* Inicia Metro Bundler: npx react-native start.

* En otra terminal (o presionando 'a' en la anterior), lanza la app: npx react-native run-android.


✅ **Funcionalidades Verificadas**

Registro con Selección de Rol: El sistema asigna automáticamente el rol 'User' a los nuevos registros, almacenándolos de forma remota.

Inicio de Sesión: Validación de credenciales contra la base de datos SQLite.

Vista Protegida: Una vez autenticado, el usuario accede al "Panel AhorroFácil", una sección restringida para usuarios no logueados.

Cierre de Sesión (Logout): Botón funcional que destruye el estado de la sesión y retorna al usuario al Login.


**✅ Declaración de Originalidad**

Declaro que este proyecto ha sido desarrollado desde cero, configurando el entorno y la base de datos de manera independiente para cumplir con los objetivos de la asignatura.