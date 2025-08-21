/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import Colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useHeaderHeight } from '@react-navigation/elements'
import { BlurView } from 'expo-blur'
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, type ImageSourcePropType } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { getAppIcon, setAppIcon } from '@howincodes/expo-dynamic-app-icon'

const ICONS = [
  {
    name: 'DEFAULT',
    icon: require('@/assets/images/icon.png') as ImageSourcePropType,
  },
  {
    name: 'dark',
    icon: require('@/assets/images/icon-dark.png') as ImageSourcePropType,
  },
  {
    name: 'vivid',
    icon: require('@/assets/images/icon-vivid.png') as ImageSourcePropType,
  },
] as const

//type icon needs to be default, dark and vivid
type Icon = (typeof ICONS)[number]['name']

const Account = () => {
  const headerHeight = useHeaderHeight()
  const { user } = useUser()
  const { signOut } = useAuth()
  const [edit, setEdit] = useState<boolean>(false)
  const [firstName, setFirstName] = useState(user?.firstName)
  const [lastName, setLastName] = useState(user?.lastName)
  const [activeIcon, setActiveIcon] = useState<Icon>('DEFAULT')

  useEffect(() => {
    const loadCurrentIconPref = () => {
      const icon = getAppIcon()
      setActiveIcon(icon)
    }

    loadCurrentIconPref()
  }, [])

  const onSaveUser = async () => {
    try {
      await user?.update({ firstName, lastName })
    } catch (error) {
      console.log('error:', error)
    } finally {
      setEdit(false)
    }
  }

  const onCaptureImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.75,
      aspect: [4, 3],
      base64: true,
    })

    if (!result.canceled) {
      const base64 = `data:image/png;base64,${result.assets[0].base64 ?? ''}`
      await user?.setProfileImage({
        file: base64,
      })
    }
  }

  const onChangeAppIcon = (icon: Icon) => {
    const name = icon !== 'DEFAULT' ? icon : null
    setAppIcon(name)
    setActiveIcon(icon)
  }

  return (
    <BlurView
      intensity={80}
      tint="dark"
      style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingTop: headerHeight }}
    >
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={styles.captureBtn} onPress={() => void onCaptureImage()}>
          {user?.imageUrl && <Image source={{ uri: user.imageUrl }} style={styles.avatar} />}
        </TouchableOpacity>

        {!edit && (
          <View style={styles.editRow}>
            <Text style={{ color: Colors.white, fontSize: 26 }}>
              {user?.firstName} {user?.lastName}
            </Text>
            <TouchableOpacity onPress={() => setEdit(true)}>
              <Ionicons name="ellipsis-horizontal" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
        )}

        {edit && (
          <View style={styles.editRow}>
            <TextInput
              placeholder="First Name"
              value={firstName ?? ''}
              onChangeText={setFirstName}
              style={[styles.inputField, {}]}
            />
            <TextInput
              placeholder="Last Name"
              value={lastName ?? ''}
              onChangeText={setLastName}
              style={[styles.inputField, {}]}
            />
            <TouchableOpacity
              disabled={(firstName?.length ?? 0) < 1 || (lastName?.length ?? 0) < 1}
              onPress={() => void onSaveUser()}
            >
              <Ionicons name="checkmark-outline" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => void signOut()}>
          <Ionicons name="log-out" size={24} color={Colors.white} />
          <Text style={{ color: Colors.white, fontSize: 18 }}>Log out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="person" size={24} color={Colors.white} />
          <Text style={{ color: Colors.white, fontSize: 18 }}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="bulb" size={24} color={Colors.white} />
          <Text style={{ color: Colors.white, fontSize: 18 }}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="megaphone" size={24} color={Colors.white} />
          <Text style={{ color: Colors.white, fontSize: 18, flex: 1 }}>Inbox</Text>
          <View
            style={{
              backgroundColor: Colors.primary,
              paddingHorizontal: 10,
              borderRadius: 10,
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: Colors.white, fontSize: 12 }}>14</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        {ICONS.map((icon) => (
          <TouchableOpacity key={icon.name} style={styles.btn} onPress={() => onChangeAppIcon(icon.name)}>
            <Image source={icon.icon} style={{ width: 30, height: 30, borderRadius: 15 }} />
            <Text style={{ color: Colors.white, fontSize: 18, flex: 1 }}>
              {icon.name.charAt(0).toLocaleUpperCase() + icon.name.slice(1).toLocaleLowerCase()}
            </Text>
            {activeIcon === icon.name && <Ionicons name="checkmark" size={30} color={Colors.white} />}
          </TouchableOpacity>
        ))}
      </View>
    </BlurView>
  )
}

export default Account

const styles = StyleSheet.create({
  actions: {
    backgroundColor: 'rgba(256,256,256,0.1)',
    borderRadius: 16,
    gap: 0,
    margin: 20,
  },
  avatar: {
    backgroundColor: Colors.lightGray,
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  btn: {
    flexDirection: 'row',
    gap: 20,
    padding: 14,
  },
  captureBtn: {
    alignSelf: 'center',
    backgroundColor: Colors.gray,
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    width: 100,
  },
  editRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  inputField: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 26,
    height: 44,
    padding: 10,
  },
})
