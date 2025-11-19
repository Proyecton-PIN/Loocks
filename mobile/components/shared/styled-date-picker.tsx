import { CalendarioIcon } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import DateTimePicker, {
  AndroidNativeProps,
  IOSNativeProps,
  WindowsNativeProps,
} from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  label?: string;
}

export default function StyledDatePicker({
  label,
  ...props
}: (IOSNativeProps | AndroidNativeProps | WindowsNativeProps) & Props) {
  const [show, setShow] = useState(false);

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
      {show && (
        <DateTimePicker
          {...props}
          testID="dateTimePicker"
          value={props.value}
          mode="date"
          is24Hour={true}
          onChange={(e, v) => {
            props.onChange?.(e, v);
            setShow(false);
          }}
        />
      )}
      <View
        className="bg-white rounded-xl px-5
        flex-row justify-between items-center h-[50px]"
      >
        <Text
          className="overflow-ellipsis"
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
        >
          {props.value?.toDateString()}
        </Text>

        <Pressable className="py-3" onPress={() => setShow(true)}>
          <CalendarioIcon color={Colors.gray} />
        </Pressable>
      </View>
    </View>
  );
}
