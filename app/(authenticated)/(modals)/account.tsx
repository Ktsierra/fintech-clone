/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import Colors from '@/constants/Colors'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { center } from '@shopify/react-native-skia'
import { BlurView } from 'expo-blur'
import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Account = () => {
  const { user } = useUser()
  const { signOut } = useAuth()
  const [edit, setEdit] = useState(false)

  // const firstName = user?.firstName ?? ''
  // const lastName = user?.lastName ?? ''

  const onSaveUser = () => {}

  const onCaptureImage = () => {}

  return (
    <BlurView intensity={80} style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      {user && (
        <View style={{ alignSelf: 'center' }}>
          {!edit && (
            <View style={styles.editRow}>
              <Text>{user.firstName}</Text>
              <Text>{user.lastName}</Text>
            </View>
          )}
        </View>
      )}
    </BlurView>
  )
}

export default Account

const styles = StyleSheet.create({
  editRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
})
