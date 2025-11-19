import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import Inicio from './inicio';

export default function RootIndex() {
  const checkAuth = useAuth((s) => s.checkAuth);

  /*useEffect(() => {
    checkAuth().then((logged) => {
      if (logged) router.replace('/(tabs)/armario' as any);
    });
  }, []);*/

  return <Inicio/>;
}
