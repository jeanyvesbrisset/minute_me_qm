import * as React from 'react';
import { Text, TouchableOpacity, View, TextInput, Button } from 'react-native';
import moment from 'moment';
import { Audio } from 'expo-av'
import { durationToStr } from '../../assets/utils/dateHelper';
import s from './styles';
import Storage from '../../modules/Storage';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

/*
This component is the recording screen,
called HomeScreen because is the one the user get
when he opens this app.
*/
export default function HomeScreen({ navigation }) {
  const [recording, setRecording] = React.useState(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [durationMillis, setDurationMillis] = React.useState(0);
  const [isDoneRecording, setDoneRecording] = React.useState(false);
  const [fileUrl, setFileUrl] = React.useState(null);
  const [itemTitle, setItemTitle] = React.useState('');
  const [speakersNumber, setSpeakersNumber] = React.useState('');

  async function onStartRecording() {
    try {
      if (recording) {
        recording.setOnRecordingStatusUpdate(null);
        setRecording(null);
      }
      await setAudioMode(true);

      const newRecording = new Audio.Recording();
      newRecording.setOnRecordingStatusUpdate(recordingCallback);
      newRecording.setProgressUpdateInterval(200);

      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setFileUrl(null);
      setRecording(newRecording);
    } catch (error) {
      console.log(error) // eslint-disable-line
    }
  }

  /*
  This function is called every x millisecond
  during the recording.
  */
  function recordingCallback(status) {
    setDurationMillis(status.durationMillis);
    if ('isRecording' in status) {
      setIsRecording(status.isRecording);
    }
    if ('isDoneRecording' in status) {
      setDoneRecording(status.isDoneRecording)
    }
  }

  async function onEndRecording() {
    try {
      await recording.stopAndUnloadAsync();
      await setAudioMode(false);
      // console.log(recording);
    } catch (error) {
      console.log(error); // eslint-disable-line
    }

    if (recording) {
      var newFileUrl = recording.getURI();
      recording.setOnRecordingStatusUpdate(null);
      setRecording(null);
      setFileUrl(newFileUrl);
    }
  }

  async function onCancelSave() {
    FileSystem.deleteAsync(fileUrl, true)
    setItemTitle('');
    setSpeakersNumber('');
    setDoneRecording(false);
    setFileUrl(null);
    setDurationMillis(0)
  }

  async function onSubmit() {
    if (isNaN(speakersNumber)) {
      alert('error')
      return
    }
    if (itemTitle && fileUrl) {
      var filename = /[^/]*$/.exec(fileUrl)[0] //filename only (with extension)
      var id = filename.replace('recording-', '').replace('.caf', '')

      const item = {
        id: id,
        audio: true, // indique si l'audio est dans le tel
        transcription: null,
        title: itemTitle,
        speakers_nb: speakersNumber,
        filename: filename,
        duration: durationMillis,
        created_at: moment().format(),
        uri: fileUrl, // audioUri,
        sent: false
      }

      Storage.insertAudio(item);
      setItemTitle('');
      setSpeakersNumber('');
      setDoneRecording(false)
      setDurationMillis(0)
    }
    navigation.navigate('audio-library')
  }

  if (!recording) {
    var button = (<TouchableOpacity onPress={onStartRecording}>
      <Ionicons name='md-radio-button-off' size={110} color="#ff1a1a" />
    </TouchableOpacity>);
  } else {
    var button = (<TouchableOpacity onPress={onEndRecording}>
      <Ionicons name='md-radio-button-on' size={110} color="#ff1a1a" />
    </TouchableOpacity>);
  }

  if (!isDoneRecording) {
    return (
      <View style={s.container}>
        <View>
          <Text style={s.chronometerText}>
            {durationToStr(durationMillis)}
          </Text>
        </View>
        <View style={s.recButtonContainer}>
          {button}
        </View>
      </View >
    );
  } else {
    return (
      <View style={s.inputContainer}>
        <TextInput
          style={s.inputStyle}
          placeholder="Give a name for your audio"
          value={itemTitle}
          onChangeText={setItemTitle}
          underlineColorAndroid='white'
          autoCorrect={false}
          onSubmitEditing={onSubmit}
          returnKeyType="done"
          autoFocus
        />
        <TextInput
          style={s.inputStyle}
          placeholder="Total number of speakers"
          value={speakersNumber}
          onChangeText={setSpeakersNumber}
          underlineColorAndroid='white'
          autoCorrect={false}
          onSubmitEditing={onSubmit}
          returnKeyType="done"
        />
        <Button
          title="Continue"
          onPress={onSubmit}
          disabled={!(itemTitle && speakersNumber)}
        />
        <Button
          title="Cancel"
          onPress={onCancelSave}
          color='red'
        />
      </View>
    );
  };
}

HomeScreen.navigationOptions = {
  header: null,
};

async function setAudioMode(allow) {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: allow,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
  } catch (error) {
    console.log(error) // eslint-disable-line
  }
}

