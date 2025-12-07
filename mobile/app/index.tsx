import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import PrendasPage from './(tabs)/armario/prendas-page';

export default function RootIndex() {
  const checkAuth = useAuth((s) => s.checkAuth);

  useEffect(() => {
    checkAuth().then((logged) => {
      if (logged) router.replace('/(tabs)/crear_outfit');
    });
  }, []);

  return <PrendasPage/>;
}
