import * as React from 'react';
import { Text, View, Button, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Storage from '../../modules/Storage';
import S3 from '../../modules/S3'
import moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';
import s from './styles';
import MinuteItem from '../../components/MinuteItem'


function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

export default function MinutesScreen({ navigation }) {
    const [minutes, setMinutes] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        refreshMinutes();

        wait(2000).then(() => setRefreshing(false));
    }, [refreshing]);

    // Loads data into 'minutes' state
    React.useMemo(() => {
        const fetchMinutes = async () => {
            const result = await Storage.getMinutes();
            setMinutes(result);
        };
        fetchMinutes();
    });

    async function refreshMinutes() {
        var minutes_to_pull = []
        var items = await Storage.getAudios()
        // console.log(items)
        for (const i of items) {
            if (i.sent == true)
                minutes_to_pull.push(i.id)
        }
        console.log(minutes_to_pull)
        S3.pullMinutes(minutes_to_pull)
    }

    return (
        <SwipeListView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    tintColor={'#1a829e'}
                    title={'Refreshing...'}
                    titleColor={'#1a829e'}
                    onRefresh={onRefresh} />
            }
            useFlatList={true}
            ListEmptyComponent={<Text style={{ color: "#1a829e", padding: 10, textAlign: 'center' }}>Pull to refresh</Text>}
            data={minutes}
            keyExtractor={(item) => item.id}
            renderItem={
                ({ item, index }) =>
                    <MinuteItem
                        item={item}
                        navigation={navigation}
                    />}
            renderHiddenItem={(row, index) => (
                <View style={s.hiddenItem}>
                    <Text>{moment(row.item.date).format('L')}</Text>
                    <TouchableOpacity style={s.deleteButton}
                        onPress={async () => await Storage.deleteTranscription(row.item)}>
                        <Ionicons name="md-trash" size={30} color="white" />
                    </ TouchableOpacity>
                </ View>
            )}
            leftOpenValue={95}
            rightOpenValue={-75}
            onRowOpen={(key, val) => {
                setTimeout(() => {
                    val[key].closeRow()
                }, 1500)
            }}
        />
    )
}
