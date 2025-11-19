import React, { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

interface Props {
  children?: ReactNode;
  onSelectColor(hex: string): void;
}

export default function ColorPickerTrigger({ children, onSelectColor }: Props) {
  return (
    <View>
      <Pressable onPress={() => {}}>{children}</Pressable>;
    </View>
  );
}
