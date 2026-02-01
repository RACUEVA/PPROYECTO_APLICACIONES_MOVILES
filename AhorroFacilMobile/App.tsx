// App.tsx
import React, { useState, useEffect } from 'react';
// SE AGREGA Image A LAS IMPORTACIONES
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { z } from 'zod';

const API_URL = 'http://10.0.2.2:5000';

const registerSchema = z.object({
  fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres").regex(/[0-9]/, "Debe incluir un número"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function App() {
  const [step, setStep] = useState(0); 
  const [isLogin, setIsLogin] = useState(true); 
  const [userToken, setUserToken] = useState<any>(null); 
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // --- DEBOUNCE (Validación Asíncrona) ---
  useEffect(() => {
    if (form.email === "") {
      setErrors((prev: any) => {
        const { email, ...rest } = prev;
        return rest;
      });
      return;
    }

    if (!isLogin && form.email.includes('@')) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          const response = await fetch(`${API_URL}/check-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: form.email }),
          });
          const data = await response.json();
          
          if (data.exists) {
            setErrors((prev: any) => ({ 
              ...prev, 
              email: "⚠️ Este correo ya está registrado" 
            }));
          }
        } catch (e) {
          console.log("Error en validación asíncrona");
        }
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [form.email, isLogin]);

  const handleAction = async () => {
    setLoading(true);
    setErrors({});
    try {
      if (isLogin) {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await response.json();
        if (response.ok) {
          setUserToken(data.user); 
          Alert.alert("¡Bienvenido!", "Ingreso exitoso.");
        } else {
          Alert.alert("Error", "Correo o contraseña incorrectos.");
        }
      } else {
        const result = registerSchema.safeParse(form);
        if (!result.success) {
          const formattedErrors: any = {};
          result.error.issues.forEach((issue) => { formattedErrors[issue.path[0]] = issue.message; });
          setErrors(formattedErrors);
          setLoading(false);
          Alert.alert("Error de validación", result.error.issues[0].message);
          return;
        }
        const response = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        
        const data = await response.json(); 

        if (response.ok) {
          Alert.alert("Éxito", "Cuenta creada. Ya puedes iniciar sesión.");
          setIsLogin(true);
        } else {
          Alert.alert("Registro Fallido", data.error || "No se pudo crear la cuenta.");
        }
      }
    } catch (e) {
      Alert.alert("Error de Conexión", "No se pudo contactar con el servidor Flask.");
    }
    setLoading(false);
  };

  if (userToken) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Panel de Ahorro</Text>
        <Text style={styles.subtitle}>Hola, {userToken.name}!</Text> 
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Saldo Disponible</Text>
          <Text style={styles.cardAmount}>$ 1,250.00</Text> 
        </View>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => {
            Alert.alert(
              "Cerrar Sesión",
              "¿Estás seguro de que deseas salir?",
              [
                { text: "Cancelar", style: "cancel" },
                { text: "Sí, salir", onPress: () => { setUserToken(null); setIsLogin(true); } }
              ]
            );
          }}
        >
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step < 3) {
    const info = [
      { t: "Bienvenido a AhorroFácil", s: "La mejor app para gestionar tus finanzas." },
      { t: "Control Total", s: "Lleva un registro de todos tus ahorros en tiempo real." },
      { t: "Seguridad Garantizada", s: "Tus datos están protegidos con la mejor tecnología." }
    ];

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{info[step].t}</Text>
        <Text style={styles.subtitle}>{info[step].s}</Text>
        <TouchableOpacity style={styles.button} onPress={() => setStep(step + 1)}>
          <Text style={styles.buttonText}>{step === 2 ? "Comenzar" : "Siguiente"}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* SE AGREGA EL LOGO AQUÍ */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('./assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>{isLogin ? "Iniciar Sesión" : "Crea tu cuenta"}</Text>
      {!isLogin && (
        <>
          <TextInput 
            style={[styles.input, errors.fullName && styles.inputError]} 
            placeholder="Nombre Completo" 
            onChangeText={(v) => setForm({...form, fullName: v})} 
          />
          {errors.fullName && <Text style={styles.errorText}>⚠️ {errors.fullName}</Text>}
        </>
      )}
      <TextInput 
        style={[styles.input, errors.email && styles.inputError]} 
        placeholder="Correo Electrónico" 
        value={form.email}
        onChangeText={(v) => {
          setForm({...form, email: v});
          if (errors.email) {
            setErrors((prev: any) => {
              const { email, ...rest } = prev;
              return rest;
            });
          }
        }} 
      />
      {errors.email && <Text style={styles.errorText}>⚠️ {errors.email}</Text>}
      <TextInput 
        style={[styles.input, errors.password && styles.inputError]} 
        placeholder="Contraseña" 
        secureTextEntry 
        onChangeText={(v) => setForm({...form, password: v})} 
      />
      {errors.password && <Text style={styles.errorText}>⚠️ {errors.password}</Text>}
      {!isLogin && (
        <>
          <TextInput 
            style={[styles.input, errors.confirmPassword && styles.inputError]} 
            placeholder="Confirmar Contraseña" 
            secureTextEntry 
            onChangeText={(v) => setForm({...form, confirmPassword: v})} 
          />
          {errors.confirmPassword && <Text style={styles.errorText}>⚠️ {errors.confirmPassword}</Text>}
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={handleAction} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isLogin ? "Ingresar" : "Registrar"}</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={{marginTop: 20}}>
        <Text style={styles.linkText}>{isLogin ? "Regístrate aquí" : "Inicia sesión"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#fff' },
  // SE AGREGAN ESTILOS PARA EL LOGO
  logoContainer: { alignItems: 'center', marginBottom: 10 },
  logo: { width: 100, height: 100 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#2ecc71', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 40, color: '#666' },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 15, padding: 10 },
  inputError: { borderColor: '#e74c3c' },
  errorText: { color: '#e74c3c', fontSize: 12, marginBottom: 10 },
  button: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 25, marginTop: 10 },
  logoutButton: { backgroundColor: '#e74c3c', padding: 15, borderRadius: 25, marginTop: 20 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  linkText: { color: '#2ecc71', textAlign: 'center', fontWeight: 'bold' },
  card: { backgroundColor: '#f9f9f9', padding: 25, borderRadius: 15, marginBottom: 30, borderWidth: 1, borderColor: '#eee' },
  cardTitle: { color: '#888', textAlign: 'center' },
  cardAmount: { fontSize: 32, fontWeight: 'bold', color: '#2ecc71', textAlign: 'center' },
});