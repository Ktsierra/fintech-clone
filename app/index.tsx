/* eslint-disable react-native/no-inline-styles */
import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { Link } from 'expo-router'
import { useVideoPlayer, type VideoSource, VideoView } from 'expo-video'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

export default function VideoScreen() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const videoSource: VideoSource = require('../assets/videos/intro.mp4')
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true
    player.muted = true
    player.play()
  })

  return (
    <View style={styles.container}>
      <VideoView player={player} style={styles.video} nativeControls={false} contentFit="fill" />
      <View style={{ padding: 20, marginTop: 80 }}>
        <Text style={styles.header}>Ready to change the way you money?</Text>
      </View>

      <View style={styles.buttons}>
        <Link href={'/login'} asChild style={[defaultStyles.pillButton, styles.link]}>
          <TouchableOpacity>
            <Text style={styles.text}>Log in</Text>
          </TouchableOpacity>
        </Link>

        <Link
          href={'/signup'}
          asChild
          style={[defaultStyles.pillButton, styles.link, { backgroundColor: Colors.lightGray }]}
        >
          <TouchableOpacity>
            <Text style={[styles.text, { color: Colors.dark }]}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    color: Colors.lightGray,
    fontSize: 36,
    fontWeight: 900,
    textTransform: 'uppercase',
  },
  link: {
    backgroundColor: Colors.dark,
    flex: 1,
  },
  text: {
    color: Colors.lightGray,
    fontSize: 22,
    fontWeight: '500',
  },
  video: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
})
