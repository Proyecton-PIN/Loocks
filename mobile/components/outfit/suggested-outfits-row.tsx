import { RefreshIcon } from '@/constants/icons';
import { useOutfit } from '@/hooks/useOutfits';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import SuggestedOutfitCard from './suggested-outfit-card';

export default function SuggestedOutfitsRow() {
  const suggestions = useOutfit((s) => s.suggested);
  const loadSuggestions = useOutfit((s) => s.loadSuggestedOutfits);
  const isLoading = useOutfit((s) => s.isLoading);
  const ref = useRef<FlatList>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-720deg'],
  });

  return (
    <View>
      <View className="flex-row justify-between pr-1">
        <Text
          style={{
            fontFamily: 'Satoshi',
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 0,
            marginBottom: 12,
          }}
        >
          Sugerencias
        </Text>
        {isLoading ? (
          <Animated.View
            style={{
              transform: [{ rotate: spin }],
              width: 24,
              height: 24,
            }}
          >
            <RefreshIcon color="black" />
          </Animated.View>
        ) : (
          <Pressable
            onPress={async () => {
              await loadSuggestions();
              ref.current?.scrollToIndex({
                index: 0,
                animated: true,
              });
            }}
          >
            <RefreshIcon color="black" />
          </Pressable>
        )}
      </View>
      <FlatList
        ref={ref}
        ItemSeparatorComponent={() => <View className="w-5" />}
        data={suggestions}
        horizontal
        renderItem={(e) => <SuggestedOutfitCard data={e.item} />}
      />
    </View>
  );
}
