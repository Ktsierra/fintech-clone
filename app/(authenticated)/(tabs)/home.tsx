/* eslint-disable react-native/no-inline-styles */
import Dropdown from '@/components/Dropdown'
import RoundButton from '@/components/RoundButton'
import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { useBalanceStore } from '@/store/balanceStore'
import { Ionicons } from '@expo/vector-icons'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

const Home = () => {
  const { balance, runTransaction, transactions, clearTransactions } = useBalanceStore()

  const onAddMoney = () => {
    const transaction = {
      id: Math.random().toString(),
      amount: Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1),
      date: new Date(),
      title: 'Added Money',
    }
    runTransaction(transaction)
    console.log('transaction:', transaction)
  }

  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance()}</Text>
          <Text style={styles.currency}>$</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <RoundButton title="Add Money" icon="add" onPress={onAddMoney} />
        <RoundButton title="Exchange" icon="refresh" />
        <RoundButton title="Details" icon="list" />
        <Dropdown />
      </View>

      <Text style={defaultStyles.sectionHeader}>Transactions</Text>
      <View style={styles.transactions}>
        {transactions.length === 0 && <Text style={{ padding: 14, color: Colors.gray }}>No transactions yet</Text>}
        {transactions.map((transaction) => (
          <View key={transaction.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={styles.circle}>
              <Ionicons name={transaction.amount > 0 ? 'add' : 'remove'} size={24} color={Colors.dark} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '400' }}>{transaction.title}</Text>
              <Text style={{ color: Colors.gray, fontSize: 12 }}>{transaction.date.toLocaleString()}</Text>
            </View>
            <Text>{transaction.amount}$</Text>
          </View>
        ))}
      </View>
      <View style={{ marginVertical: 20 }}>
        <RoundButton title="Clear Transactions" icon="trash" onPress={clearTransactions} />
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
  circle: {
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
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
  transactions: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    gap: 20,
    marginHorizontal: 20,
    padding: 14,
  },
})
