import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';

export default function login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    setError('');
    
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    
    // Preparar datos en formato JSON
    const loginData = {
      email: email,
      password: password
    };

    // Simulación de envío
    console.log('Datos de login enviados:', JSON.stringify(loginData, null, 2));
    
    setTimeout(() => {
      fetch(`https://localhost:8080/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })
        .then(() => {
          alert('Login exitoso!');
          setIsLoading(false);
          setEmail('');
          setPassword('');
        })
        .catch(() => {
          setIsLoading(false);
          setError('Error al iniciar sesión');
        });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
          <p className="text-gray-600">Ingresa tus credenciales</p>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="block w-full pl-12 pr-4 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="block w-full pl-12 pr-14 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <Ionicons name="eye-off-outline" size={20} color="#9CA3AF" />
                ) : (
                  <Ionicons name="eye-outline" size={20} color="#9CA3AF" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-base active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}