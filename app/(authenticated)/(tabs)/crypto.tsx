/* eslint-disable react-native/no-inline-styles */
import { Text, View, Image } from 'react-native'
import { type CoinMarketCapInfoResponse, type CoinMarketCapListingsResponse } from '@/interfaces/crypto'
import { useQuery } from '@tanstack/react-query'
import Colors from '@/constants/Colors'

const Home = () => {
  const currencies = useQuery<CoinMarketCapListingsResponse>({
    queryKey: ['listings'],
    queryFn: () => fetch('/api/listings').then((res) => res.json()),
  })

  const ids = currencies.data?.map((currency) => currency.id).join(',') ?? ''

  const { data } = useQuery<CoinMarketCapInfoResponse>({
    queryKey: ['info', ids],
    queryFn: () => fetch(`/api/info?ids=${ids}`).then((res) => res.json()),
    enabled: !!ids,
  })

  console.log('JSON.stringify(data, null, 2):', JSON.stringify(data, null, 2))
  return (
    <View>
      {currencies.data?.map((currency) => (
        <View
          key={currency.id}
          style={{ flexDirection: 'row', backgroundColor: Colors.lightGray, padding: 12, margin: 8 }}
        >
          <Image source={{ uri: data?.[currency.id]?.logo }} style={{ width: 32, height: 32 }} />
          <Text>{currency.name}</Text>
        </View>
      ))}
    </View>
  )
}

export default Home
