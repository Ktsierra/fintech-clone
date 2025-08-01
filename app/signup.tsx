/* eslint-disable react-native/no-inline-styles */
import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
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

const Signup = () => {
  const [countryCode, setCountryCode] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0
  const router = useRouter()
  const { signUp } = useSignUp()

  const onSignup = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`
    try {
      await signUp?.create({
        phoneNumber: fullPhoneNumber,
      })

      await signUp?.preparePhoneNumberVerification({
        strategy: 'phone_code',
      })
      router.push({ pathname: '/verify/[phone]', params: { phone: fullPhoneNumber } })
    } catch (error) {
      console.error('error', JSON.stringify(error, null, 2))
      if (isClerkAPIResponseError(error)) {
        if (error.errors[0].code === 'form_identifier_not_found') {
          Alert.alert('Error', error.errors[0].message)
        }
      }
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset}>
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let&apos;s get started!</Text>
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

        <Link href="/login" replace asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </Link>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={[defaultStyles.pillButton, phoneNumber !== '' ? styles.enabledButton : styles.disabledButton]}
          onPress={() => void onSignup()}
        >
          <Text style={defaultStyles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Signup

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
