import { CalendarioIcon } from '@/constants/icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  onChange(value?: Date): void;
  currentValue?: Date;
}

export default function CustomDatePicker({
  onChange,
  currentValue = new Date(),
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={currentValue ?? new Date()}
          mode="date"
          is24Hour={true}
          onChange={(_, value) => {
            onChange(value);
            setShow(false);
          }}
        />
      )}
      <View
        className="bg-white rounded-lg px-4
        flex-row justify-between items-center"
      >
        <Text className="text-black text-lg overflow-ellipsis">
          {currentValue!.toDateString()}
        </Text>

        <Pressable className="py-3" onPress={() => setShow(true)}>
          <CalendarioIcon />
        </Pressable>
      </View>
    </>
  );
}
