import { create } from 'zustand/react'

export interface Transaction {
  id: string
  amount: number
  date: Date
  title: string
}

export interface BalanceState {
  transactions: Transaction[]
  runTransaction: (transaction: Transaction) => void
  balance: () => number
  clearTransactions: () => void
}

export const useBalanceStore = create<BalanceState>()
