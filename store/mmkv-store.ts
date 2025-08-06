import { type StateStorage } from 'zustand/middleware'
import { MMKV } from 'react-native-mmkv'

// this storage its passed to the zustand persist middleware storage option
// in CreateJSONStorage to persist the store in the device storage
// using MMKV for better performance
// this is the same for every store you want to persist just a different id and
// store interface

const storage = new MMKV({
  id: 'balance-storage',
})

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    storage.set(name, value)
  },
  getItem: (name) => {
    const value = storage.getString(name)
    return value ?? null
  },
  removeItem: (name) => {
    storage.delete(name)
  },
}
