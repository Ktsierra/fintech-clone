import Colors from '@/constants/Colors'
import { useAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Image, AppState, View, StyleSheet, type AppStateStatus, type ImageSourcePropType } from 'react-native'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV({
  id: 'inactivity-storage',
})

const imageLogo = require('@/assets/images/icon-vivid.png') as ImageSourcePropType

const PrivacyScreen = () => (
  <View style={styles.privacyScreen}>
    <Image source={imageLogo} style={styles.logo} resizeMode="contain" />
  </View>
)

const styles = StyleSheet.create({
  logo: {
    height: 100,
    width: 100,
  },
  privacyScreen: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 999,
  },
})

export const UserInactivityProvider = ({ children }: { children: React.ReactNode }) => {
  const appState = useRef(AppState.currentState)
  const router = useRouter()
  const [showPrivacyScreen, setShowPrivacyScreen] = useState(false)
  const { isSignedIn } = useAuth()

  useEffect(() => {
    function handleAppStateChange(nextAppState: AppStateStatus) {
      switch (nextAppState) {
        case 'inactive':
        case 'background': {
          setShowPrivacyScreen(true)
          recordStartTime()
          break
        }
        case 'active': {
          setShowPrivacyScreen(false)
          if (appState.current === 'background') {
            const elapsed = Date.now() - (storage.getNumber('startTime') ?? 0)
            if (elapsed > 3000 && isSignedIn) {
              router.replace('/(authenticated)/(modals)/lock')
            }
          }
          break
        }
        default: {
          break
        }
      }
      appState.current = nextAppState
    }
    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => subscription.remove()
  }, [isSignedIn, router])

  function recordStartTime() {
    storage.set('startTime', Date.now())
  }
  return (
    <>
      {children}
      {showPrivacyScreen && <PrivacyScreen />}
    </>
  )
}
