import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo'
import { Link, useLocalSearchParams } from 'expo-router'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
const CELL_COUNT = 6

const Page = () => {
  const { phone, signin } = useLocalSearchParams<{ phone: string; signin: string }>()
  const [code, setCode] = useState('')
  const { signIn, isLoaded: isSignInLoaded } = useSignIn()
  const { isLoaded: isSignUpLoaded, signUp, setActive } = useSignUp()

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  })

  const verifyCode = useCallback(async () => {
    if (!isSignUpLoaded) return
    try {
      const signUpAttempt = await signUp.attemptPhoneNumberVerification({
        code,
      })
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUp.createdSessionId })
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error('error', JSON.stringify(err, null, 2))
      if (isClerkAPIResponseError(err)) {
        Alert.alert('Error', err.errors[0].message)
      }
    }
  }, [code, setActive, signUp, isSignUpLoaded])

  const verifySignIn = useCallback(async () => {
    if (!isSignInLoaded || !isSignUpLoaded) return
    try {
      await signIn.attemptFirstFactor({
        strategy: 'phone_code',
        code,
      })
      await setActive({ session: signIn.createdSessionId })
    } catch (err) {
      console.error('error', JSON.stringify(err, null, 2))
      if (isClerkAPIResponseError(err)) {
        Alert.alert('Error', err.errors[0].message)
      }
    }
  }, [code, isSignInLoaded, isSignUpLoaded, setActive, signIn])

  useEffect(() => {
    if (code.length === 6) {
      if (signin === 'true') {
        void verifySignIn()
      } else {
        void verifyCode()
      }
    }
  }, [code, signin, verifyCode, verifySignIn])

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>6-digit code</Text>
      <Text style={defaultStyles.descriptionText}>Code sent to {phone} unless you already have an account</Text>

      <CodeField
        ref={ref}
        {...props}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Fragment key={index}>
            <View
              // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}
            >
              <Text style={styles.cellText}>{symbol || (isFocused && <Cursor />)}</Text>
            </View>
            {index === 2 && <View key={`separator-${index.toString()}`} style={styles.separator} />}
          </Fragment>
        )}
      />

      <Link href={'/login'} replace asChild>
        <TouchableOpacity>
          <Text style={defaultStyles.textLink}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  cellRoot: {
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    height: 60,
    justifyContent: 'center',
    width: 45,
  },
  cellText: {
    color: Colors.dark,
    fontSize: 36,
    textAlign: 'center',
  },
  codeFieldRoot: {
    gap: 12,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 20,
  },
  focusCell: {
    paddingBottom: 8,
  },
  separator: {
    alignSelf: 'center',
    backgroundColor: Colors.gray,
    height: 2,
    width: 10,
  },
})
export default Page
