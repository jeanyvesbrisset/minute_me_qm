import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chronometerText: {
        paddingVertical: 100,
        fontSize: 90,
        fontWeight: '200',
        color: '#1a829e',
        textAlign: 'center',
        alignItems: 'center',
    },
    recButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
    inputContainer: {
        flex: 1,
        backgroundColor: '#fbfbfb',
        alignItems: 'center',
    },
    inputStyle: {
        marginTop: 50,
        paddingBottom: 5,
        color: 'black',
        fontSize: 15,
        fontWeight: '400',
        textAlign: 'center',
        width: '90%',
        borderBottomWidth: 2,
        borderBottomColor: '#1a829e',
    }
});

export default styles;
