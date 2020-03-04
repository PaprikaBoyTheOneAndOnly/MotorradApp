import React, {Component} from 'react';
import Home from './src/screen/Home';
import Settings from './src/screen/Settings';
import Photos from './src/screen/Photos';
import Routes from './src/screen/Routes';
import Map from './src/screen/Map';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import TrackRoute from './src/screen/TrackRoute';
import {stackConfig} from './src/data.module';
import Route from './src/screen/Route';
import * as Location from 'expo-location';
import * as Firebase from './src/service/FirebaseService';
import Login from './src/screen/Login';
import Drawer from "./src/component/Drawer";

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
        Routes: RoutesStack,
        Map: MapStack,
        Photos: PhotosStack,
        Settings: SettingsStack,
    },
    {
        drawerBackgroundColor: 'rgba(0,0,0,0.5)',
        contentOptions: {
            inactiveTintColor: 'white',
        },
        contentComponent: Drawer

    });


const AuthStack = createStackNavigator({Login, MainStack}, {
    defaultNavigationOptions: {
        gestureEnabled: false,
        headerStyle: {

            height: 0,
        },
        headerTintColor: 'transparent',
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
