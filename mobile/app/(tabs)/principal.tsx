import React from 'react';
import { ScrollView, View } from 'react-native';
import CrearOutfit from '../crear_outfit';

export default function Principal() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F3F3F3' }}>
      <View style={{ padding: 12 }}>
        {/* Render the CrearOutfit UI directly in the main screen */}
        <CrearOutfit />
      </View>
    </ScrollView>
  );
}
