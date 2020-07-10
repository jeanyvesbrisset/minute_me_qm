import * as React from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import moment from 'moment';
import s from '../screens/AudioLibraryScreen/styles';

export default function MinuteItem({ item, navigation }) {

    return (
        <TouchableHighlight onPress={() => navigation.navigate('Transcription', { item: item })
        }>
            <View style={[s.option]}>
                <View style={{ flexDirection: 'row', alignItems: "stretch" }}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={s.optionTextContainer}>
                                <Text style={s.optionText}>{item.title}</Text>
                            </View>
                        </View>
                        <View style={s.optionTextContainer}>
                            <Text style={s.dateText}>{moment(item.created_at).fromNow()}</Text>
                        </View>
                    </View>
                </View>
            </View >
        </TouchableHighlight >
    );
}