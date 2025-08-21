/* eslint-disable react-native/no-inline-styles */
import { Text, ScrollView, Image, TouchableOpacity, View } from 'react-native'
import { type CoinMarketCapInfoResponse, type CoinMarketCapListingsResponse } from '@/interfaces/crypto'
import { useQuery } from '@tanstack/react-query'
import Colors from '@/constants/Colors'
import { Link } from 'expo-router'
import { useHeaderHeight } from '@react-navigation/elements'
import { defaultStyles } from '@/constants/Styles'
import { Ionicons } from '@expo/vector-icons'

const Crypto = () => {
  const headerHeight = useHeaderHeight()

  const currencies = useQuery<CoinMarketCapListingsResponse>({
    queryKey: ['listings'],
    queryFn: () => fetch('/api/listings').then((res) => res.json()),
  })

  const listings = currencies.data?.data ?? []
  const ids = listings.map((currency) => currency.id).join(',')

  const { data } = useQuery<CoinMarketCapInfoResponse>({
    queryKey: ['info', ids],
    queryFn: () => fetch(`/api/info?ids=${ids}`).then((res) => res.json()),
    enabled: ids.length > 0,
  })

  return (
    <ScrollView style={{ backgroundColor: Colors.background }} contentContainerStyle={{ paddingTop: headerHeight }}>
      <Text style={defaultStyles.sectionHeader}>Latest Crypto</Text>
      <View style={defaultStyles.block}>
        {listings.map((currency) => {
          const price = currency.quote.USD.price
          const percent_change_24h = currency.quote.USD.percent_change_24h
          const isPositiveChange = percent_change_24h > 0
          const changeColor = isPositiveChange ? 'green' : 'red'
          const caretIcon = isPositiveChange ? 'caret-up' : 'caret-down'

          return (
            <Link href={`/crypto/${currency.id.toString()}`} key={currency.id} asChild>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 8 }}>
                {data?.[currency.id]?.logo ? (
                  <Image source={{ uri: data[currency.id].logo }} style={{ width: 40, height: 40 }} />
                ) : (
                  <View style={{ width: 40, height: 40, backgroundColor: Colors.lightGray, borderRadius: 20 }} />
                )}
                <View style={{ flex: 1, gap: 6 }}>
                  <Text style={{ fontWeight: 600, color: Colors.dark }}>{currency.name}</Text>
                  <Text style={{ color: Colors.gray }}>{currency.symbol}</Text>
                </View>
                <View style={{ gap: 6, alignItems: 'flex-end' }}>
                  <Text>{price.toFixed(2)} $</Text>
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    <Ionicons style={{ alignSelf: 'center' }} name={caretIcon} color={changeColor} size={16} />
                    <Text style={{ color: changeColor }}>{percent_change_24h.toFixed(2)} %</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          )
        })}
      </View>
    </ScrollView>
  )
}

export default Crypto
