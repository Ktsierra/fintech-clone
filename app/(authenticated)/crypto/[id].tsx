/* eslint-disable react-native/no-inline-styles */
import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { type CoinMarketCapInfoResponse } from '@/interfaces/crypto'
import { Ionicons } from '@expo/vector-icons'
import { useHeaderHeight } from '@react-navigation/elements'
import { useQuery } from '@tanstack/react-query'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { SectionList, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'

const categories = ['Overview', 'News', 'Orders', 'Transactions']

export default function Crypto() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const headerHeight = useHeaderHeight()
  const [activeIndex, setActiveIndex] = useState(0)

  const { data } = useQuery<CoinMarketCapInfoResponse>({
    queryKey: ['info', id],
    queryFn: () => fetch(`/api/info?ids=${id}`).then((res) => res.json()),
  })

  const coin = data?.[id]

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
        renderItem={({ item }) => (
          <>
            <View style={{ height: 500, backgroundColor: 'blue' }}>
              <></>
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
