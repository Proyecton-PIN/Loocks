import React, { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  children?: ReactNode;
  onSelectColor(hex: string): void;
}

export default function ColorPickerTrigger({ children, onSelectColor }: Props) {
  const renderChild = () => {
    if (typeof children === 'string') return <Text>{children}</Text>;
    return children;
  };

  return (
    <View>
      <Pressable onPress={() => { /* debes pasar el hex adecuado aquí */ }}>
        {renderChild()}
      </Pressable>
    </View>
  );
}
