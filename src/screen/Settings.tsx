import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {globalStyles, staticNavigationOptions} from '../data.module';

interface IProps {
}

interface IState {
}

export default class Settings extends Component<IProps, IState> {
    static navigationOptions = ({navigation}) => ({
        ...staticNavigationOptions(navigation)
    });

    render() {
        return (
            <View style={styles.container}>
                <Text>Settings Screen works!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create(
// @ts-ignore
    {
        ...globalStyles,
    }
);
