import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import AudioLibraryScreen from '../screens/AudioLibraryScreen/AudioLibraryScreen';
import MinutesScreen from '../screens/MinutesScreen/MinutesScreen';
import TranscriptionScreen from '../screens/MinutesScreen/MinuteStack/TranscriptionSubScreen'
import { screensEnabled } from 'react-native-screens';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

const MinuteStack = createStackNavigator();

function createMinuteStack() {
  return (
    <MinuteStack.Navigator>
      <MinuteStack.Screen name='Minutes' component={MinutesScreen} />
      <MinuteStack.Screen name='Transcription' component={TranscriptionScreen} />
    </MinuteStack.Navigator>
  )
}

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerShown: getHeaderTitle(route) == "Minutes" ? false : true, headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-mic" />,
        }}
      />
      <BottomTab.Screen
        name="audio-library"
        component={AudioLibraryScreen}
        options={{
          title: 'Audio Library',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-recording" />,
        }}
      />
      <BottomTab.Screen
        name="minutes"
        children={createMinuteStack}
        options={{
          title: 'Minutes',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'home':
      return 'Minute.me';
    case 'audio-library':
      return 'Audio library';
    case 'minutes':
      return 'Minutes';
  }
}
