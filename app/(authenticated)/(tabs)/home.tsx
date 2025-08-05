import Dropdown from '@/components/Dropdown'
import RoundButton from '@/components/RoundButton'
import Colors from '@/constants/Colors'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

const Home = () => {
  const balance = 1420

  const onAddMoney = () => {
    // Logic to add money
    console.log('Add Money pressed')
  }

  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance}</Text>
          <Text style={styles.currency}>$</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <RoundButton title="Add Money" icon="add" onPress={onAddMoney} />
        <RoundButton title="Exchange" icon="refresh" />
        <RoundButton title="Details" icon="list" />
        <Dropdown />
      </View>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
  account: {
    alignItems: 'center',
    margin: 80,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  balance: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  currency: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  row: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
})
