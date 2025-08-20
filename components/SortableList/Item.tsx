import React, { type ReactNode } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  withSpring,
  scrollTo,
  withTiming,
  useSharedValue,
  runOnJS,
  type SharedValue,
  type AnimatedRef,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { animationConfig, COL, getOrder, getPosition, type Positions, SIZE } from './Config'

interface ItemProps {
  children: ReactNode
  positions: SharedValue<Positions>
  id: string
  editing: boolean
  onDragEnd: (diffs: Positions) => void
  scrollView: AnimatedRef<Animated.ScrollView>
  scrollY: SharedValue<number>
}

const Item = ({ children, positions, id, onDragEnd, scrollView, scrollY, editing }: ItemProps) => {
  const inset = useSafeAreaInsets()
  const containerHeight = Dimensions.get('window').height - inset.top - inset.bottom

  // DO NOT read positions.value here (render). Initialize neutral values:
  const isGestureActive = useSharedValue(false)

  // Initialize at neutral values; the UI thread reaction will set initial positions immediately
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const context = useSharedValue({ x: 0, y: 0 })

  // Place the tile initially and respond to order changes on the UI thread.
  useAnimatedReaction(
    () => positions.value[id],
    (newOrder, previous) => {
      const pos = getPosition(newOrder)
      if (previous === null) {
        // Initial placement: set immediately (no animation) so there's no visual jump
        translateX.value = pos.x
        translateY.value = pos.y
      } else if (!isGestureActive.value) {
        // Animate to new position on regular updates
        translateX.value = withTiming(pos.x, animationConfig)
        translateY.value = withTiming(pos.y, animationConfig)
      }
    }
  )

  const panGesture = Gesture.Pan()
    .enabled(editing)
    .onBegin(() => {
      // Set up context for dragging
      isGestureActive.value = true
    })
    .onStart(() => {
      // Save initial positions
      context.value = { x: translateX.value, y: translateY.value }
    })
    .onUpdate((event) => {
      const ctx = context.value
      translateX.value = ctx.x + event.translationX
      translateY.value = ctx.y + event.translationY

      // Compute contentHeight and scroll bounds on the UI thread (do not read these on render)
      const contentHeight = (Object.keys(positions.value).length / COL) * SIZE
      const lowerBound = scrollY.value
      const upperBound = lowerBound + containerHeight - SIZE
      const maxScroll = contentHeight - containerHeight
      const leftToScrollDown = maxScroll - scrollY.value

      // 1. Calculate where the tile should be
      const newOrder = getOrder(translateX.value, translateY.value, Object.keys(positions.value).length - 1)

      // 2. Swap positions if needed
      const oldOlder = positions.value[id]
      if (newOrder !== oldOlder) {
        const idToSwap = Object.keys(positions.value).find((key) => positions.value[key] === newOrder)
        if (idToSwap) {
          const newPositions = { ...positions.value }
          newPositions[id] = newOrder
          newPositions[idToSwap] = oldOlder
          positions.value = newPositions
        }
      }

      // 3. Scroll up and down if necessary
      if (translateY.value < lowerBound) {
        const diff = Math.min(lowerBound - translateY.value, lowerBound)
        scrollY.value -= diff
        scrollTo(scrollView, 0, scrollY.value, false)
        ctx.y -= diff
        translateY.value = ctx.y + event.translationY
      }
      if (translateY.value > upperBound) {
        const diff = Math.min(translateY.value - upperBound, leftToScrollDown)
        scrollY.value += diff
        scrollTo(scrollView, 0, scrollY.value, false)
        ctx.y += diff
        translateY.value = ctx.y + event.translationY
      }
    })
    .onEnd(() => {
      const newPosition = getPosition(positions.value[id])
      translateX.value = withTiming(newPosition.x, animationConfig, () => {
        runOnJS(onDragEnd)(positions.value)
      })
      translateY.value = withTiming(newPosition.y, animationConfig)
    })
    .onFinalize(() => {
      isGestureActive.value = false
    })

  const style = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 100 : 0
    const scale = withSpring(isGestureActive.value ? 1.05 : 1)
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: SIZE,
      height: SIZE,
      zIndex,
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale }],
    }
  })

  return (
    <Animated.View style={style}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={StyleSheet.absoluteFill}>{children}</Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}

export default Item
