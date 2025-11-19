import React from 'react';
import { Modal, Text, View } from 'react-native';

interface Props {
  show: boolean;
}

export default function ImageAnalyzingModal({ show }: Props) {
  return (
    <Modal visible={show} animationType="slide">
      <View className="items-center justify-center flex-1">
        <Text>Cargando</Text>
      </View>
    </Modal>
  );
}
