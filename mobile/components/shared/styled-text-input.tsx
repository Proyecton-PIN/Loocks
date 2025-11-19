import { Colors } from '@/constants/theme';
import clsx from 'clsx';
import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface Props {
  label?: string;
}

export default function StyledTextInput(props: TextInputProps & Props) {
  return (
    <View>
      {props.label && (
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
          {props.label}
        </Text>
      )}
      <TextInput
        {...props}
        className={clsx('bg-white rounded-xl px-5 h-[50px]', props.className)}
        placeholderTextColor={Colors.muted}
        style={{
          color: Colors.black,
          fontFamily: 'Satoshi',
          fontWeight: 500,
          fontStyle: 'normal',
          fontSize: 18,
          lineHeight: 1.1 * 18,
          letterSpacing: 0,
          verticalAlign: 'middle',
        }}
      />
    </View>
  );
}
