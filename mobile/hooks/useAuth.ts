import { checkAuth, login } from '@/lib/logic/services/auth-service';
import { create } from 'zustand';

interface State {
  logged: boolean;
  error?: string;

  checkAuth(): Promise<boolean>;
  login(email: string, password: string): Promise<void>;
}

export const useAuth = create<State>((set, get) => ({
  logged: false,

  async checkAuth() {
    const logged = await checkAuth();
    set({ logged });
    return logged;
  },

  async login(email: string, password: string): Promise<void> {
    set({ error: undefined });

    if (!email || !password) {
      set({ error: 'Por favor, completa todos los campos' });
      return;
    }

    if (!validateEmail(email)) {
      set({ error: 'Por favor, ingresa un correo electrónico válido' });
      return;
    }

    if (password.length < 5) {
      set({ error: 'La contraseña debe tener al menos 5 caracteres' });
      return;
    }

    const message = await login(email, password);
    if (message) {
      set({ error: message });
    } else {
      set({ logged: true });
    }
  },
}));

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
