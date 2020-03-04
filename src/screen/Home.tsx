import React, {Component} from 'react';
import {StyleSheet, TextInput, View, Text, Keyboard} from 'react-native';
import {globalStyles, Route, stackConfig, staticNavigationOptions} from '../data.module';
import * as LocationService from '../service/LocationService';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button} from 'react-native-elements';

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    routeName: string;
    error: string;
}

export default class Home extends Component<IProps, IState> {
    static navigationOptions = ({navigation}) => ({
        ...staticNavigationOptions(navigation)
    });

    constructor(props) {
        super(props);

        this.state = {
            routeName: null,
            error: '',
        };
    }

    startRoute = async () => {
        Keyboard.dismiss();
        if (!this.state.routeName || this.state.routeName.length < 3) {
            this.setState({error: 'Routename must be at least 3 characters'});
        } else {
            const origin = await LocationService.getCurrentPosition();
            this.props.navigation.navigate('TrackRoute', {
                options: {
                    ...stackConfig,
                    title: this.state.routeName,
                },
                title: this.state.routeName,
                route: new Route(this.state.routeName, origin),
            });
            this.setState({routeName: '', error: ''});
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <TextInput style={styles.input} value={this.state.routeName}
                           placeholder={'Routename'}
                           onChangeText={(text) => this.setState({routeName: text})}/>
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{this.state.error}</Text>
                </View>
                <Button title={'Start route'} onPress={this.startRoute} type={'outline'}/>
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
