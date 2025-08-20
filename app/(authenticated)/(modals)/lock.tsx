/* eslint-disable react-native/no-inline-styles */
import Colors from '@/constants/Colors'
import { useUser } from '@clerk/clerk-expo'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

const CODE_LENGTH = 6

const Lock = () => {
  const { user } = useUser()
  const [code, setCode] = useState<number[]>([])
  const router = useRouter()
  const offset = useSharedValue(0)

  const firstName = user?.firstName ?? 'User'

  const shakeAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    }
  })

  const OFFSET = 20
  const TIME = 80
  const numberRows: number[][] = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]

  useEffect(() => {
    if (code.length === 6) {
      if (code.join('') === '000000') {
        // Example code for testing
        router.replace('/(authenticated)/(tabs)/home')
        setCode([])
      } else {
        offset.value = withSequence(
          withTiming(-OFFSET, { duration: TIME / 2 }),
          withRepeat(withTiming(OFFSET, { duration: TIME / 2 }), 4, true),
          withTiming(0, { duration: TIME / 2 })
        )
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
          .catch((error: unknown) => {
            if (error instanceof Error) {
              console.error('Haptics error:', error.message)
            } else {
              console.error('Haptics error:', String(error))
            }
          })
          .finally(() => setCode([]))
      }
    }
  }, [code, offset, router])

  const onNumberPress = async (num: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setCode((prevCode) => {
      if (prevCode.length < CODE_LENGTH) {
        return [...prevCode, num]
      }
      return prevCode
    })
  }

  const onNumberBackspace = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setCode((prevCode) => {
      if (prevCode.length > 0) {
        return prevCode.slice(0, -1)
      }
      return prevCode
    })
  }

  const onBiometricAuthPress = async () => {
    const { success } = await LocalAuthentication.authenticateAsync()
    if (success) {
      router.replace('/(authenticated)/(tabs)/home')
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch((error: unknown) => {
        if (error instanceof Error) {
          console.error('Haptics error:', error.message)
        } else {
          console.error('Haptics error:', String(error))
        }
      })
    }
  }

  return (
    <SafeAreaView>
      <Text style={styles.greeting}>Welcome back, {firstName}</Text>

      <Animated.View style={[styles.codeView, shakeAnimation]}>
        {Array.from({ length: CODE_LENGTH }).map((_, index) => (
          <View
            key={index}
            style={[styles.codeEmpty, { backgroundColor: code[index] >= 0 ? Colors.primary : Colors.lightGray }]}
          />
        ))}
      </Animated.View>

      <View style={styles.numbersView}>
        {numberRows.map((row) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} key={row[0]}>
            {row.map((num) => (
              <TouchableOpacity key={num} onPress={() => void onNumberPress(num)}>
                <Text style={styles.number}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => void onBiometricAuthPress()}>
            <MaterialCommunityIcons name="face-recognition" size={32} color={Colors.dark} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => void onNumberPress(0)}>
            <Text style={styles.number}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => void onNumberBackspace()}>
            <Ionicons name="backspace-outline" size={32} color={Colors.dark} />
          </TouchableOpacity>
        </View>
        <Text style={{ alignSelf: 'center', color: Colors.primary, fontWeight: '500', fontSize: 18 }}>
          Forgot your passcode?
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default Lock

const styles = StyleSheet.create({
  codeEmpty: {
    borderRadius: 15,
    height: 30,
    width: 30,
  },
  codeView: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    marginVertical: 100,
  },
  greeting: {
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 80,
  },
  number: {
    fontSize: 32,
  },
  numbersView: {
    gap: 60,
    marginHorizontal: 80,
  },
})
