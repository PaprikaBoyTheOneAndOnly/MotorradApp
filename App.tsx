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
import {globalStyles, stackConfig} from './src/data.module';
import Route from './src/screen/Route';
import * as Firebase from './src/service/FirebaseService';
import * as LocationService from './src/service/LocationService';
import Login from './src/screen/Login';
import Drawer from './src/component/Drawer';
import {StyleSheet, Text, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import RoutePhotos from './src/screen/RoutePhotos';
import Photo from './src/screen/Photo';
import Upload from './src/screen/Upload';

Firebase.initialize();

const HomeStack = createStackNavigator({Home, TrackRoute, Route, Upload}, stackConfig);

const SettingsStack = createStackNavigator({Settings}, stackConfig);

const RoutesStack = createStackNavigator({Routes, Route, RoutePhotos, Photo}, stackConfig);

const PhotosStack = createStackNavigator({Photos, RoutePhotos, Photo}, stackConfig);

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
        contentOptions: {inactiveTintColor: 'white'},
        contentComponent: Drawer

    });


const AuthStack = createStackNavigator({Login, MainStack}, {
    defaultNavigationOptions: {
        gestureEnabled: false,
        headerStyle: {height: 0},
        headerTintColor: 'transparent',
    }
});

const AppContainer = createAppContainer(AuthStack);


interface IAppState {
    locationPermission: boolean;
}

export default class App extends Component<{}, IAppState> {
    constructor(props) {
        super(props);
        this.state = {
            locationPermission: null,
        }
    }

    componentDidMount() {
        LocationService.requestPermissionAsync()
            .then(perm => {
                this.setState({locationPermission: perm.granted});
            });
        ImagePicker.requestCameraRollPermissionsAsync().then();
        ImagePicker.requestCameraPermissionsAsync().then();
    }

    render() {
        if (!this.state.locationPermission) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>Please allow permission on location usage for this App!</Text>
                    <Text style={styles.text}>You can change the permission in your device settings.</Text>
                </View>);
        }

        return <AppContainer/>;
    }
}

const styles = StyleSheet.create(
// @ts-ignore
    {
        ...globalStyles,
        text: {
            margin: 10,
            width: '90%',
            textAlign: 'center',
        }
    }
);
