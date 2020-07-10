import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    hiddenItem: {
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
    },
    deleteButton: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        backgroundColor: 'red',
        right: 0,
    },
    transcriptionContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    transcriptionText: {
        fontSize: 16,
        textAlign: 'justify'
    }
});

export default styles;
