import React, { Component } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

interface IProps {
}

interface IState {
}

export default class Settings extends Component<IProps, IState> {
    render() {
        return (
            <View style={styles.container}>
                <Text>Settings Screen works!</Text>
                <Text>Icons made by
                    <Text style={styles.link}
                          onPress={() =>
                              Linking.openURL('https://www.flaticon.com/authors/xnimrodx')
                          }> xnimrodx </Text>
                    from
                    <Text style={styles.link}
                          onPress={() =>
                              Linking.openURL('https://www.flaticon.com/')
                          }> www.flaticon.com</Text>
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create(
    {
        link: {
            color: 'blue',
        },
        container: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
