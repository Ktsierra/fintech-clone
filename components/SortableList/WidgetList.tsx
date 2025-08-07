/* eslint-disable react-native/no-inline-styles */
import React from 'react'

import { MARGIN } from './Config'
import Tile from './Tile'
import SortableList from './SortableList'
import { View } from 'react-native'

// This is monstly copied slop from the original code, but with some
// modifications for type safety and updating the deprecated APIs
// to reuse this in another app it probably requires some work on
// the Tiles and WidgetList components

const tiles = [
  {
    id: 'spent',
  },
  {
    id: 'cashback',
  },
  {
    id: 'recent',
  },
  {
    id: 'cards',
  },
]

const WidgetList = () => {
  return (
    <View
      style={{
        paddingHorizontal: MARGIN,
        marginBottom: 80,
      }}
    >
      <SortableList
        editing={true}
        onDragEnd={(positions) => {
          console.log(JSON.stringify(positions, null, 2))
        }}
      >
        {tiles.map((tile, index) => (
          <Tile onLongPress={() => true} key={tile.id + '-' + index.toString()} id={tile.id} />
        ))}
      </SortableList>
    </View>
  )
}

export default WidgetList
