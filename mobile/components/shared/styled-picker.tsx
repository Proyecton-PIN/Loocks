import { Picker, PickerProps } from '@react-native-picker/picker';
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  label?: string;
}

export default function StyledPicker<T>({
  label,
  ...props
}: Props & PickerProps<T>) {
  return (
    <View>
      {label && (
        <Text
          style={{
            fontFamily: 'Satoshi',
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 18,
            letterSpacing: 0,
            verticalAlign: 'middle',
            marginBottom: 12,
          }}
        >
          {label}
        </Text>
      )}
      <View className="bg-white rounded-lg px-2 textx-base text-black">
        <Picker {...props}>{props.children}</Picker>
      </View>
    </View>
  );
}
