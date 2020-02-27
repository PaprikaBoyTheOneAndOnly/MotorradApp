import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {}

interface IState {}

export default class Routes extends Component<IProps,  IState> {
    render() {
        return (
            <View style={styles.container}>
                <Text>Routes Screen works!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
