/* eslint-disable react-native/no-inline-styles */
import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'

const SIGN_IN_METHODS = {
  PHONE: 'Phone',
  EMAIL: 'Email',
  GOOGLE: 'Google',
  APPLE: 'Apple',
} as const

type SignInType = (typeof SIGN_IN_METHODS)[keyof typeof SIGN_IN_METHODS]

const Login = () => {
  const [countryCode, setCountryCode] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0
  const router = useRouter()
  const { signIn } = useSignIn()

  const onSignin = async (type: SignInType) => {
    switch (type) {
      case 'Phone': {
        {
          try {
            const fullPhoneNumber = `${countryCode}${phoneNumber}`

            const signInAttemp = await signIn?.create({
              identifier: fullPhoneNumber,
            })

            const firstPhoneFactor = signInAttemp?.supportedFirstFactors?.find((factor) => {
              return factor.strategy === 'phone_code'
            })

            if (!firstPhoneFactor) throw new Error()

            const { phoneNumberId } = firstPhoneFactor

            await signIn?.prepareFirstFactor({
              strategy: 'phone_code',
              phoneNumberId,
            })

            router.push({ pathname: '/verify/[phone]', params: { phone: fullPhoneNumber, signed: 'true' } })
          } catch (error) {
            console.error('error', JSON.stringify(error, null, 2))
            if (isClerkAPIResponseError(error)) {
              if (error.errors[0].code === 'form_identifier_not_found') {
                Alert.alert('Error', error.errors[0].message)
              }
            }
          }
        }
        break
      }
      case 'Email': {
        // Handle email sign-in logic here
        console.log('Signing in with email')
        break
      }
      case 'Google': {
        // Handle Google sign-in logic here
        console.log('Signing in with Google')
        break
      }
      case 'Apple': {
        // Handle Apple sign-in logic here
        console.log('Signing in with Apple')
        break
      }
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset}>
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome back</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number. We will send you a confirmation code there
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Country Code"
            placeholderTextColor={Colors.gray}
            keyboardType="numeric"
            value={countryCode}
            onChangeText={setCountryCode}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Mobile number"
            placeholderTextColor={Colors.gray}
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <TouchableOpacity
          disabled={phoneNumber === ''}
          style={[
            defaultStyles.pillButton,
            phoneNumber !== '' ? styles.enabledButton : styles.disabledButton,
            { marginVertical: 20 },
          ]}
          onPress={() => {
            void onSignin(SIGN_IN_METHODS.PHONE)
          }}
        >
          <Text style={defaultStyles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.gray }} />
          <Text style={{ fontSize: 20, color: Colors.gray }}>or</Text>
          <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.gray }} />
        </View>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: 'row',
              gap: 16,
              marginTop: 20,
              backgroundColor: Colors.lightGray,
            },
          ]}
          onPress={() => {
            void onSignin(SIGN_IN_METHODS.EMAIL)
          }}
        >
          <Ionicons name="mail" size={24} color={Colors.dark} />
          <Text style={[defaultStyles.buttonText, { color: Colors.dark }]}>Continue with email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: 'row',
              gap: 16,
              marginTop: 20,
              backgroundColor: Colors.lightGray,
            },
          ]}
          onPress={() => {
            void onSignin(SIGN_IN_METHODS.GOOGLE)
          }}
        >
          <Ionicons name="logo-google" size={24} color={Colors.dark} />
          <Text style={[defaultStyles.buttonText, { color: Colors.dark }]}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: 'row',
              gap: 16,
              marginTop: 20,
              backgroundColor: Colors.lightGray,
            },
          ]}
          onPress={() => {
            void onSignin(SIGN_IN_METHODS.APPLE)
          }}
        >
          <Ionicons name="logo-apple" size={24} color={Colors.dark} />
          <Text style={[defaultStyles.buttonText, { color: Colors.dark }]}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Login

const styles = StyleSheet.create({
  disabledButton: {
    backgroundColor: Colors.primaryMuted,
  },
  enabledButton: {
    backgroundColor: Colors.primary,
  },
  input: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    fontSize: 20,
    marginRight: 10,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
})
