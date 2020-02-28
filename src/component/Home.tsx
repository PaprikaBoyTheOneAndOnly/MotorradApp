import React, {Component} from 'react';
import {Button, StyleSheet, TextInput, View} from 'react-native';
import {globalStyles, Route, stackConfig} from '../data.module';
import * as LocationService from '../service/LocationService';
import {StackNavigationProp} from '@react-navigation/stack';

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    routeName: string;
}

export default class Home extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            routeName: '',
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput style={styles.input} value={this.state.routeName}
                           placeholder={'Routename'}
                           onChangeText={(text) => this.setState({routeName: text})}/>
                <Button title={'Start route'} onPress={async () => {
                    const origin = await LocationService.getCurrentPosition();
                    this.props.navigation.navigate('TrackRoute', {
                        options: {
                            ...stackConfig,
                            title: this.state.routeName,
                        },
                        title: this.state.routeName,
                        route: new Route(this.state.routeName, origin),
                    });
                    this.setState({routeName: ''});
                }}/>
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
