import Colors from '@/constants/Colors'
import React, { Fragment } from 'react'
import { View, Text, StyleSheet, type StyleProp, type ViewStyle, type TextStyle } from 'react-native'
import {
  CodeField,
  type CodeFieldProps,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'

interface Props extends Omit<CodeFieldProps, 'renderCell'> {
  value: string
  onChangeText: (text: string) => void
  cellCount?: number
  cellRootStyle?: StyleProp<ViewStyle>
  cellTextStyle?: StyleProp<TextStyle>
  separatorStyle?: StyleProp<ViewStyle>
}

const VerificationCodeField: React.FC<Props> = ({
  value,
  onChangeText,
  cellCount = 6,
  rootStyle,
  keyboardType = 'number-pad',
  textContentType = 'oneTimeCode',
  cellRootStyle,
  cellTextStyle,
  separatorStyle,
  ...rest
}) => {
  const ref = useBlurOnFulfill({ value, cellCount })
  const [cellProps, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue: onChangeText })

  const separatorIndex = Math.floor(cellCount / 2) - 1

  return (
    <CodeField
      ref={ref}
      {...cellProps}
      value={value}
      onChangeText={onChangeText}
      cellCount={cellCount}
      rootStyle={[styles.codeFieldRoot, rootStyle]}
      keyboardType={keyboardType}
      textContentType={textContentType}
      {...(rest as CodeFieldProps)}
      renderCell={({ index, symbol, isFocused }) => (
        <Fragment key={index}>
          <View
            // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, cellRootStyle, isFocused && styles.focusCell]}
          >
            <Text style={[styles.cellText, cellTextStyle]}>{symbol || (isFocused && <Cursor />)}</Text>
          </View>
          {index === separatorIndex && (
            <View key={`separator-${index.toString()}`} style={[styles.separator, separatorStyle]} />
          )}
        </Fragment>
      )}
    />
  )
}

const styles = StyleSheet.create({
  cellRoot: {
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    height: 60,
    justifyContent: 'center',
    width: 45,
  },
  cellText: {
    color: Colors.dark,
    fontSize: 36,
    textAlign: 'center',
  },
  codeFieldRoot: {
    gap: 12,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 20,
  },
  focusCell: {
    paddingBottom: 8,
  },
  separator: {
    alignSelf: 'center',
    backgroundColor: Colors.gray,
    height: 2,
    width: 10,
  },
})

export default VerificationCodeField
