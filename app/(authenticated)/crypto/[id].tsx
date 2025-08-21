/* eslint-disable react-native/no-inline-styles */
import { format } from 'date-fns'
import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { type CryptoTicker, type CoinMarketCapInfoResponse } from '@/interfaces/crypto'
import { Ionicons } from '@expo/vector-icons'
import { useHeaderHeight } from '@react-navigation/elements'
import { Circle, type DataSourceParam, useFont } from '@shopify/react-native-skia'
import { useQuery } from '@tanstack/react-query'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { SectionList, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import { CartesianChart, Line, useChartPressState } from 'victory-native'
import SpaceMono from '@/assets/fonts/SpaceMono-Regular.ttf'
import * as Haptics from 'expo-haptics'
import {
  runOnJS,
  useDerivedValue,
  type SharedValue,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'

const categories = ['Overview', 'News', 'Orders', 'Transactions']

const INIT_STATE = {
  x: '0',
  y: { price: 0 },
}

function ToolTip({ x, y, color }: { x: SharedValue<number>; y: SharedValue<number>; color: string }) {
  return <Circle cx={x} cy={y} r={8} color={color} />
}

export default function Crypto() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const headerHeight = useHeaderHeight()
  const [activeIndex, setActiveIndex] = useState(0)
  const font = useFont(SpaceMono as DataSourceParam, 12)
  const { state, isActive } = useChartPressState(INIT_STATE)
  const [currentDiff, setCurrentDiff] = useState(0)
  const [currentDate, setCurrentDate] = useState('')
  const colorProgress = useSharedValue(0)

  const { data } = useQuery<CoinMarketCapInfoResponse>({
    queryKey: ['info', id],
    queryFn: () => fetch(`/api/info?ids=${id}`).then((res) => res.json()),
  })

  const coin = data?.[id]

  const { data: tickers } = useQuery<CryptoTicker[]>({
    queryKey: ['tickers', coin?.name],
    queryFn: () => fetch(`/api/tickers?name=${coin?.name ?? ''}`).then((res) => res.json()),
    enabled: !!coin?.name,
  })

  useEffect(() => {
    if (isActive) {
      Haptics.selectionAsync()
        .then()
        .catch((e: unknown) => console.error('Haptics error:', e))
    } else if (tickers) {
      setCurrentDiff(tickers[tickers.length - 1].price - tickers[0].price)
    }
  }, [isActive, tickers])

  const diffValue = useDerivedValue(() => {
    if (!tickers || tickers.length === 0) return 0
    const latestPrice = tickers[tickers.length - 1].price
    const touchPrice = state.y.price.value.value
    return latestPrice - touchPrice
  }, [tickers])

  // Update state when derived value changes
  useDerivedValue(() => {
    runOnJS(setCurrentDiff)(diffValue.value)
    runOnJS(setCurrentDate)(state.x.value.value)
  }, [diffValue, state.x.value])

  const color = currentDiff === 0 ? 'black' : currentDiff > 0 ? 'green' : 'red'

  return (
    <>
      <Stack.Screen options={{ title: coin?.name }} />
      <SectionList
        style={{ marginTop: headerHeight }}
        contentInsetAdjustmentBehavior="automatic"
        sections={[{ data: [{ title: 'Chart' }] }]}
        keyExtractor={(item) => item.title}
        renderSectionHeader={() => (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingBottom: 8,
              backgroundColor: Colors.background,
              borderBlockColor: Colors.lightGray,
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category}
                style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
                onPress={() => setActiveIndex(index)}
              >
                <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        ListHeaderComponent={() => (
          <>
            <View style={styles.headerComponent}>
              <Text style={styles.subtitle}>{coin?.symbol}</Text>
              <Image source={{ uri: coin?.logo }} style={{ width: 60, height: 60 }} />
            </View>

            <View style={{ flexDirection: 'row', gap: 10, margin: 12 }}>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  { backgroundColor: Colors.primary, flexDirection: 'row', gap: 16 },
                ]}
              >
                <Ionicons name="add" size={24} color={Colors.white} />
                <Text style={[defaultStyles.buttonText, { color: Colors.white }]}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  { backgroundColor: Colors.primaryMuted, flexDirection: 'row', gap: 16 },
                ]}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
                <Text style={[defaultStyles.buttonText, { color: Colors.white }]}>Receive</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        renderItem={() => (
          <>
            <View style={[defaultStyles.block, { height: 500 }]}>
              {!tickers && <Text>Loading</Text>}
              {tickers && (
                <>
                  {!isActive && (
                    <View>
                      <Text style={{ fontSize: 30, fontWeight: 'bold', color: Colors.dark }}>
                        {tickers[tickers.length - 1].price.toFixed(2)}
                      </Text>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.gray }}>Today</Text>
                    </View>
                  )}
                  {isActive && (
                    <View>
                      <Text style={{ fontSize: 30, fontWeight: 'bold', color: Colors.dark }}>
                        {tickers[tickers.length - 1].price - currentDiff}
                      </Text>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.gray }}>
                        {format(currentDate, 'E, MMMM do, yyyy ')}
                      </Text>
                    </View>
                  )}
                  <CartesianChart
                    chartPressState={state}
                    data={tickers}
                    xKey="timestamp"
                    yKeys={['price']}
                    axisOptions={{
                      font,
                      tickCount: 3,
                      labelOffset: { x: -2, y: 0 },
                      labelColor: Colors.gray,
                      formatXLabel: (t) => format(new Date(t), 'MM/yy'),
                      formatYLabel: (v) => `${v > 10000 ? (v / 1000).toString() + 'k' : v.toString()} $ `,
                    }}
                  >
                    {({ points }) => (
                      <>
                        <Line
                          points={points.price}
                          color={color}
                          strokeWidth={3}
                          animate={{ type: 'timing', duration: 300 }}
                        />
                        {isActive && <ToolTip x={state.x.position} y={state.y.price.position} color={color} />}
                      </>
                    )}
                  </CartesianChart>
                </>
              )}
            </View>
            <View style={[defaultStyles.block, { marginTop: 20 }]}>
              <Text style={styles.subtitle}>Overview</Text>
              <Text style={{ color: Colors.gray }}>{coin?.description}</Text>
            </View>
          </>
        )}
      />
    </>
  )
}

const styles = StyleSheet.create({
  categoriesBtn: {
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    padding: 10,
    paddingHorizontal: 14,
  },
  categoriesBtnActive: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    justifyContent: 'center',
    padding: 10,
    paddingHorizontal: 14,
  },
  categoryText: {
    color: Colors.gray,
    fontSize: 14,
  },
  categoryTextActive: {
    color: Colors.dark,
    fontSize: 14,
  },
  headerComponent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  subtitle: {
    color: Colors.gray,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
})
