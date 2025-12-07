import React, { useEffect, useMemo, useRef } from 'react'
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

const EmblaCarousel: React.FC<PropType> = ({ slides, options, renderSlide, onSelect, initialIndex = 0 }) => {
  const screenWidth = Dimensions.get('window').width
  const spacing = options?.spacing ?? 8
  const itemWidth = Math.round((options?.itemWidth ?? Math.min(screenWidth - 80, 260)))
  const loop = options?.loop ?? false

  const looped = useMemo(() => {
    if (!loop || slides.length <= 1) return slides
    const first = slides[0]
    const last = slides[slides.length - 1]
    return [last, ...slides, first]
  }, [slides, loop])

  const scrollRef = useRef<ScrollView | null>(null)

  useEffect(() => {
    if (!scrollRef.current) return
    const start = loop && slides.length > 1 ? initialIndex + 1 : initialIndex
    const itemSize = itemWidth + spacing
    setTimeout(() => {
      scrollRef.current?.scrollTo({ x: itemSize * start, animated: false })
    }, 30)
  }, [initialIndex, itemWidth, spacing, loop, slides.length])

  const containerPadding =  screenWidth / 2 - itemWidth / 2 - 15;
  const itemSize = itemWidth + spacing

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
}

const styles = StyleSheet.create({
  embla: { width: '100%' },
  container: { flexDirection: 'row', alignItems: 'center' },
})

export default EmblaCarousel
