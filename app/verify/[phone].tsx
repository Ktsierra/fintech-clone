import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo'
import { Link, useLocalSearchParams } from 'expo-router'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import VerificationCodeField from '@/components/VerificationCodeField'
const CELL_COUNT = 6

const Page = () => {
  const { phone, signed } = useLocalSearchParams<{ phone: string; signed: string }>()
  const [code, setCode] = useState('')
  const { signIn, isLoaded: isSignInLoaded, setActive: setActiveSignIn } = useSignIn()
  const { isLoaded: isSignUpLoaded, signUp, setActive: setActiveSignup } = useSignUp()

  const verifyCode = useCallback(async () => {
    if (!isSignUpLoaded) return
    try {
      const signUpAttempt = await signUp.attemptPhoneNumberVerification({
        code,
      })
      if (signUpAttempt.status === 'complete') {
        await setActiveSignup({ session: signUp.createdSessionId })
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error('error', JSON.stringify(err, null, 2))
      if (isClerkAPIResponseError(err)) {
        Alert.alert('Error', err.errors[0].message)
      }
    }
  }, [code, setActiveSignup, signUp, isSignUpLoaded])

  const verifySignIn = useCallback(async () => {
    if (!isSignInLoaded) return
    try {
      await signIn.attemptFirstFactor({
        strategy: 'phone_code',
        code,
      })
      await setActiveSignIn({ session: signIn.createdSessionId })
    } catch (err) {
      console.error('error', JSON.stringify(err, null, 2))
      if (isClerkAPIResponseError(err)) {
        Alert.alert('Error', err.errors[0].message)
      }
    }
  }, [code, isSignInLoaded, setActiveSignIn, signIn])

  useEffect(() => {
    if (code.length === 6) {
      if (signed === 'true') {
        void verifySignIn()
      } else {
        void verifyCode()
      }
    }
  }, [code, signed, verifyCode, verifySignIn])

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>6-digit code</Text>
      <Text style={defaultStyles.descriptionText}>Code sent to {phone} unless you already have an account</Text>

      <VerificationCodeField value={code} onChangeText={setCode} cellCount={CELL_COUNT} />

      <Link href={'/login'} replace asChild>
        <TouchableOpacity>
          <Text style={defaultStyles.textLink}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({})
export default Page
