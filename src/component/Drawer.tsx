import {SafeAreaView, ScrollView} from 'react-navigation';
import {DrawerItems} from 'react-navigation-drawer';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

export default function Drawer(props) {
    return (
        <ScrollView scrollEnabled={false}
                    contentContainerStyle={styles.contentContainer}>
            <SafeAreaView style={styles.container}
                          forceInset={{top: 'always', horizontal: 'never'}}>
                <DrawerItems {...props} />
            </SafeAreaView>
            <TouchableOpacity onPress={() => {
                props.navigation.dispatch({
                    type: 'Navigation/NAVIGATE',
                    routeName: 'Login',
                    action: {
                        type: 'Navigation/NAVIGATE',
                        routeName: 'Login',
                    }
                });
            }}>
                <Text style={{color: 'red', fontSize: 16, margin: 16}}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>);
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
    }
});
