import reactNativeConfig from '@ktsierra/eslint-config/react-native'

export default [
  ...reactNativeConfig(),
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]
