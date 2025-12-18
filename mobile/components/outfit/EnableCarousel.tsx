import React, { useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from 'react'
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

type PropType = {
  slides: any[]
  options?: { loop?: boolean; spacing?: number; itemWidth?: number }
  renderSlide?: (item: any, index: number) => React.ReactElement | null
  onSelect?: (index: number, item: any) => void
  initialIndex?: number
}

// Definimos qué funciones pueden usarse desde fuera
export type EmblaCarouselRef = {
  scrollToIndex: (params: { index: number; animated?: boolean }) => void;
}

const EmblaCarousel = forwardRef<EmblaCarouselRef, PropType>(({ slides, options, renderSlide, onSelect, initialIndex = 0 }, ref) => {
  const screenWidth = Dimensions.get('window').width
  const spacing = options?.spacing ?? 8
  const itemWidth = Math.round((options?.itemWidth ?? Math.min(screenWidth - 80, 260)))
  const loop = options?.loop ?? true

  const looped = useMemo(() => {
    if (!loop || slides.length <= 1) return slides
    const first = slides[0]
    const last = slides[slides.length - 1]
    return [last, ...slides, first]
  }, [slides, loop])

  const scrollRef = useRef<ScrollView | null>(null)
  const itemSize = itemWidth + spacing

  // --- ESTA ES LA CLAVE PARA EL SCROLL AUTOMÁTICO ---
  useImperativeHandle(ref, () => ({
    scrollToIndex: ({ index, animated = true }) => {
      if (!scrollRef.current) return;
      
      // Ajustamos el índice porque si hay loop, el array visual tiene un elemento extra al principio
      const targetVisualIndex = (loop && slides.length > 1) ? index + 1 : index;
      const offset = targetVisualIndex * itemSize;

      scrollRef.current.scrollTo({ x: offset, animated });
    }
  }));
  // --------------------------------------------------

  useEffect(() => {
    if (!scrollRef.current) return
    const start = loop && slides.length > 1 ? initialIndex + 1 : initialIndex
    setTimeout(() => {
      scrollRef.current?.scrollTo({ x: itemSize * start, animated: false }) // false al inicio para que no maree
    }, 20)
  }, [initialIndex, itemWidth, spacing, loop, slides.length, itemSize])

  const containerPadding = screenWidth / 2 - itemWidth / 2 - 15;

  function handleMomentum(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const offset = e.nativeEvent.contentOffset.x
    const rawIndex = Math.round(offset / itemSize)

    if (!loop || slides.length <= 1) {
      const clamped = Math.max(0, Math.min(rawIndex, slides.length - 1))
      onSelect && onSelect(clamped, slides[clamped])
      return
    }

    const n = slides.length
    if (rawIndex === 0) {
      onSelect && onSelect(n - 1, slides[n - 1])
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: itemSize * n, animated: false })
      }, 40)
      return
    }

    if (rawIndex === n + 1) {
      onSelect && onSelect(0, slides[0])
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: itemSize * 1, animated: false })
      }, 40)
      return
    }

    if (rawIndex >= 1 && rawIndex <= n) {
      const logicalIndex = rawIndex - 1
      onSelect && onSelect(logicalIndex, slides[logicalIndex])
    }
  }

  return (
    <View style={styles.embla}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        snapToInterval={itemSize}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: containerPadding, alignItems: 'center' }}
        onMomentumScrollEnd={handleMomentum}
      >
        <View style={styles.container}>
          {looped.map((s, i) => {
            const base = s && (s.id ?? s.key) ? String(s.id ?? s.key) : 'slide'
            const uniqueKey = `${base}-${i}`
            const isLast = i === looped.length - 1
            return (
              <View key={uniqueKey} style={{ width: itemWidth, marginRight: isLast ? 0 : spacing }}>
                {renderSlide ? renderSlide(s, i) : null}
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
});

const styles = StyleSheet.create({
  embla: { width: '100%' },
  container: { flexDirection: 'row', alignItems: 'center' },
})

export default EmblaCarousel