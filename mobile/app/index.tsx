import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import Inicio from './incio';

export default function RootIndex() {
  const checkAuth = useAuth((s) => s.checkAuth);

  useEffect(() => {
    checkAuth().then((logged) => {
      if (logged) router.replace('/(tabs)/armario' as any);
    });
  }, []);

  return <Inicio/>;
}
