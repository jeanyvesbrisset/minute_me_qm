import * as FileSystem from 'expo-file-system';
import { AsyncStorage } from 'react-native';


function compareItemDates(item1, item2) {
    return item1.created_at < item2.created_at
}

const Storage = {
    getUserToken: async function () {
        await AsyncStorage.getItem('user-token')
    },
    insertAudio: async function (item) {
        await AsyncStorage.setItem(item.id, JSON.stringify(item))
    },
    setItem: async function (id, key, new_value) {
        var update = {}
        update[key] = new_value
        await AsyncStorage.mergeItem(id, JSON.stringify(update))
        console.log(await AsyncStorage.getItem(id))
    },
    deleteAudio: async function (item) {
        FileSystem.deleteAsync(item.uri, true)
        await AsyncStorage.removeItem(item.id)
    },
    deleteTranscription: async function (item) {
        await this.setItem(item.id, 'transcription', null)
    },
    getAudios: async function () {
        var keys = await AsyncStorage.getAllKeys()
        var audios = []
        for (const key of keys) {
            var item = await AsyncStorage.getItem(key)
            item = JSON.parse(item)
            if (item && item.audio == true)
                audios.push(item)
        }
        return (audios.sort(compareItemDates))
    },
    getMinutes: async function () {
        var keys = await AsyncStorage.getAllKeys()
        var minutes = []
        for (const key of keys) {
            var item = await AsyncStorage.getItem(key)
            item = JSON.parse(item)
            if (item && (item.transcription || item.transcription == ''))
                minutes.push(item)
        }
        return (minutes.sort(compareItemDates))
    },
    clear: async function () {
        await AsyncStorage.clear()
    }

}

export default Storage;