import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Storage from '../../modules/Storage';
import S3 from '../../modules/S3'
import moment from 'moment';
import { Audio } from 'expo-av';
import { SwipeListView } from 'react-native-swipe-list-view';
import s from './styles';
import AudioItem from '../../components/AudioItem'


export default function AudioLibraryScreen() {
  const [audios, setAudios] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [playbackInstance, setPlaybackInstance] = React.useState(null)
  const [isPlaying, setIsPlaying] = React.useState(null)

  // Loads data into 'audios' state
  React.useMemo(() => {
    const fetchAudios = async () => {
      const result = await Storage.getAudios();
      setAudios(result);
    };
    fetchAudios();
  });

  async function soundCallback(status) {
    if (status.didJustFinish) {
      // playbackInstance.stopAsync();
      setIsPlaying(null)
    }
    // else if (status.isLoaded) {
    //   const position = props.isSeeking()
    //     ? props.position
    //     : status.positionMillis;
    //   const isPlaying = (props.isSeeking() || status.isBuffering)
    //     ? props.isPlaying
    //     : status.isPlaying;
    //   props.setState({
    //     position,
    //     duration: status.durationMillis,
    //     shouldPlay: status.shouldPlay,
    //     isPlaying,
    //     isBuffering: status.isBuffering,
    //   });
    // }

  }

  async function playAudio(id, url) {
    setIsLoading(true);
    if (playbackInstance) {
      await playbackInstance.unloadAsync();
      playbackInstance.setOnPlaybackStatusUpdate(null);
      setPlaybackInstance(null)
    }
    try {
      const { newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, positionMillis: 0, duration: 1, progressUpdateIntervalMillis: 50 },
        soundCallback,
      );
      setIsLoading(false)
      setIsPlaying(id)
      setPlaybackInstance(newSound)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  async function stopAudio(uri) {
    if (playbackInstance) {
      playbackInstance.stopAsync();
      setPlaybackInstance(null);
      setIsPlaying(null)
    }
    setIsPlaying(null)
  }


  return (
    <SwipeListView
      useFlatList={true}
      data={audios}
      keyExtractor={(item) => item.id}
      renderItem={
        ({ item, index }) =>
          <AudioItem
            item={item}
            play={playAudio}
            stop={stopAudio}
            isPlaying={isPlaying}
          />}
      renderHiddenItem={(row, index) => (
        <View style={s.hiddenItem}>
          <Text>{moment(row.item.date).format('L')}</Text>
          <TouchableOpacity style={s.processButton}
            onPress={async () => console.log(await S3.uploadRecording(row.item))}>
            <Ionicons name="md-document" size={30} color="white" />
          </ TouchableOpacity>
          <TouchableOpacity style={s.deleteButton}
            onPress={async () => await Storage.deleteAudio(row.item)}>
            <Ionicons name="md-trash" size={30} color="white" />
          </ TouchableOpacity>
        </ View>
      )}
      leftOpenValue={95}
      rightOpenValue={-150}
      onRowOpen={(key, val) => {
        setTimeout(() => {
          val[key].closeRow()
        }, 1500)
      }}
    />
  )
}
