import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand/react'
import { zustandStorage } from './mmkv-store'

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

//this uses the mmkv storage defined in mmkv-store
// to persist the store in device storage

export const useBalanceStore = create<BalanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      runTransaction: (transaction: Transaction) => {
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        }))
      },
      balance: () => {
        return get().transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
      },
      clearTransactions: () => {
        set({ transactions: [] })
      },
    }),
    {
      name: 'balance',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)
