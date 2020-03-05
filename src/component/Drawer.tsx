import {SafeAreaView, ScrollView} from 'react-navigation';
import {DrawerItems} from 'react-navigation-drawer';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import * as Firebase from '../service/FirebaseService';

function logout(props) {
    Firebase.logout().then();
    props.navigation.dispatch({
        type: 'Navigation/NAVIGATE',
        routeName: 'Login',
        action: {
            type: 'Navigation/NAVIGATE',
            routeName: 'Login',
        }
    });
}

export default function Drawer(props) {
    return (
        <ScrollView scrollEnabled={false}
                    contentContainerStyle={styles.contentContainer}>
            <SafeAreaView style={styles.container}
                          forceInset={{top: 'always', horizontal: 'never'}}>
                <DrawerItems {...props} />
            </SafeAreaView>
            <TouchableOpacity onPress={() => logout(props)}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        height: '100%',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    logoutButton: {
        backgroundColor: 'red',
        position: 'absolute',
        bottom: 0
    },
    logoutText: {
        color: 'red',
        fontSize: 16,
        margin: 16
    },
});
