/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import { BlurView } from 'expo-blur'
import Colors from '@/constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

const CustomHeader = () => {
  const { top } = useSafeAreaInsets()
  return (
    <BlurView style={{ paddingTop: top }} intensity={80} tint="extraLight">
      <View style={styles.container}>
        <TouchableOpacity style={styles.roundButton}>
          <Text style={{ color: Colors.white, fontWeight: '500', fontSize: 16 }}>JS</Text>
        </TouchableOpacity>

        <View style={styles.searchSection}>
          <Ionicons style={styles.searchIcon} name="search" size={20} color={Colors.dark} />
          <TextInput style={styles.input} placeholder="Search" placeholderTextColor={Colors.dark} />
        </View>

        <View style={styles.circle}>
          <Ionicons name="stats-chart" size={24} color={Colors.dark} />
        </View>

        <View style={styles.circle}>
          <Ionicons name="card" size={24} color={Colors.dark} />
        </View>
      </View>
    </BlurView>
  )
}

export default CustomHeader

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    gap: 10,
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    color: Colors.dark,
    flex: 1,
    paddingLeft: 0,
    paddingRight: 10,
    paddingVertical: 10,
  },
  roundButton: {
    alignItems: 'center',
    backgroundColor: Colors.gray,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  searchIcon: {
    padding: 10,
  },
  searchSection: {
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 30,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
})
