import Colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type IoniconName = keyof typeof Ionicons.glyphMap

interface RoundButtonProps {
  title: string
  icon: IoniconName
  onPress?: () => void
}

const RoundButton = ({ title, icon, onPress }: RoundButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.circle}>
        <Ionicons name={icon} size={40} color={Colors.dark} />
      </View>
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  )
}

export default RoundButton

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  container: {
    alignItems: 'center',
    gap: 10,
  },
  label: {
    color: Colors.dark,
    fontSize: 16,
    fontWeight: '500',
  },
})
