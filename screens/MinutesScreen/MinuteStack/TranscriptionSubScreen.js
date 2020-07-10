import * as React from 'react';
import { Text, View, ScrollView, TouchableHighlight } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s from '../styles'

export default function TranscriptionScreen({ route }) {

    return (
        <ScrollView style={s.transcriptionContainer}>
            <Text style={s.transcriptionText}> {route.params.item.transcription}</Text>
        </ScrollView>
    );
}