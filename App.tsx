import React, {Component} from 'react';
import Home from './src/component/Home';
import Settings from './src/component/Settings';
import Photos from './src/component/Photos';
import Routes from './src/component/Routes';
import Map from './src/component/Map';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import TrackRoute from './src/component/TrackRoute';
import {stackConfig} from './src/data.module';
import Route from './src/component/Route';
import * as Location from 'expo-location';
import * as Firebase from './src/service/FirebaseService';
import Login from './src/component/Login';

Firebase.initialize();

const HomeStack = createStackNavigator(
    {
        Home,
        TrackRoute,
        Route
    }, stackConfig);

const SettingsStack = createStackNavigator({Settings}, stackConfig);

const RoutesStack = createStackNavigator({Routes, Route}, stackConfig);

const PhotosStack = createStackNavigator({Photos}, stackConfig);

const MapStack = createStackNavigator({Map}, stackConfig);

const MainStack = createDrawerNavigator(
    {
        Home: HomeStack,
        Settings: SettingsStack,
        Routes: RoutesStack,
        Photos: PhotosStack,
        Map: MapStack,
    },
    {
        drawerBackgroundColor: 'rgba(0,0,0,0.5)',
        contentOptions: {
            inactiveTintColor: 'white',
        },
    });

const AuthStack = createStackNavigator({Login, MainStack}, {
    defaultNavigationOptions: {
        headerStyle: {
            height: 0,
        },
    }
});

const AppContainer = createAppContainer(AuthStack);

export default class App extends Component<{}, {}> {
    componentDidMount() {
        Location.requestPermissionsAsync().then();
    }

    render() {
        return (
            <AppContainer/>
        );
    }
}
