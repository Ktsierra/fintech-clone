import Colors from '@/constants/Colors'
import { FontAwesome } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { StyleSheet } from 'react-native'

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <FontAwesome name="registered" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <FontAwesome name="line-chart" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transfers"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <FontAwesome name="exchange" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lifestyle"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <FontAwesome name="th" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="crypto"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <FontAwesome name="bitcoin" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}

export default Layout
