import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import s from '../screens/AudioLibraryScreen/styles';
import { durationToStr } from '../assets/utils/dateHelper';

export default function AudioItem({ item, isPlaying, play, stop }) {
    if (isPlaying == item.id) {
        var button = (
            <TouchableOpacity onPress={() => stop()}>
                <View style={s.optionIconContainer}>
                    <Ionicons name="md-square" size={25} color="#1a829e" />
                </View>
            </TouchableOpacity>
        )
    } else {
        var button = (
            <TouchableOpacity onPress={() => play(item.id, item.uri)}>
                <View style={s.optionIconContainer}>
                    <Ionicons name="md-play" size={30} color="#1a829e" />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={[s.option]}>
            <View style={{ flexDirection: 'row', alignItems: "stretch" }}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={s.optionTextContainer}>
                            <Text style={s.optionText}>{item.title}</Text>
                        </View>
                    </View>
                    <View style={s.optionTextContainer}>
                        <Text style={s.dateText}>{moment(item.created_at).fromNow()} - {durationToStr(item.duration)}</Text>
                    </View>
                </View>
                {button}
            </View>
        </View >
    );
}