import React, {Component} from 'react';
import {AppState, AppStateStatus, AsyncStorage, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {globalStyles, ICoordinate, IRoute, Route, StorageKey, Task} from '../data.module';
import * as TaskManager from 'expo-task-manager';
import MapView, {Marker} from 'react-native-maps';
import * as LocationService from '../service/LocationService';
import {defineTrackTask} from '../service/TaskManager';
import {StackActions} from 'react-navigation';
import {StackNavigationProp} from '@react-navigation/stack';
import * as Firebase from '../service/FirebaseService';
import ActivityRunner from "./ActivityRunner";
import {LocationData} from "expo-location";

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    route: IRoute;
    remove: any;
    initialCoordinates: ICoordinate,
}

defineTrackTask();

export default class TrackRoute extends Component<IProps, IState> {
    static navigationOptions = ({navigation}) => (navigation.state.params.options);

    constructor(props) {
        super(props);
        this.state = {
            route: this.props.navigation.getParam('route'),
            remove: () => {
            },
            initialCoordinates: null
        };
    }

    addRoute = (coordinate: LocationData) => {
        const route = this.state.route;
        const coords: ICoordinate = {
            longitude: coordinate.coords.longitude,
            latitude: coordinate.coords.latitude
        };
        route.polylineCoordinates.push(coords);

        this.setState({route});
    };

    componentDidMount() {
        LocationService.subscribeToPosition(this.addRoute)
            .then((remove) => this.setState({remove: remove.remove}));
        LocationService.getCurrentPosition()
            .then(coordinate => this.setState({initialCoordinates: coordinate}));
        AppState.addEventListener('change', this.handleAppChange);
    }

    componentWillUnmount() {
        this.state.remove();
        AppState.removeEventListener('change', this.handleAppChange);
        AsyncStorage.removeItem(StorageKey.CURRENT_ROUTE_COORDS).then();
    }

    private handleAppChange = (appState: AppStateStatus) => {
        if (appState === 'active') {
            AsyncStorage.getItem(StorageKey.CURRENT_ROUTE_COORDS)
                .then((result) => {
                    if (result !== null) {
                        const locations: ICoordinate[] = JSON.parse(result);
                        const route = this.state.route;
                        locations.forEach(location => route.polylineCoordinates.push(location));
                        AsyncStorage.removeItem(StorageKey.CURRENT_ROUTE_COORDS).then();
                    }
                });
            TaskManager.isTaskRegisteredAsync(Task.TRACK_ROUTE).then((isRegistered) => {
                if (isRegistered) {
                    LocationService.stopTrackingPositionInBackground();
                }
            });

        } else if (appState === 'background') {
            LocationService.trackPositionInBackground();
        }
    };

    private stopRoute = async () => {
        const route = this.state.route as Route;
        route.destination = await LocationService.getCurrentPosition();
        //TODO is not right
        route.calculateDistance();
        Firebase.saveRoute(route);
        this.props.navigation.dispatch(StackActions.replace(
            {
                routeName: 'Route',
                params: {route}
            }));
    };

    render() {
        if (this.state.initialCoordinates) {
            const initialRegion = {
                ...this.state.initialCoordinates,
                latitudeDelta: 0.004,
                longitudeDelta: 0.004,
            };
            return (
                <View style={styles.container}>
                    <MapView style={{height: '100%', width: '100%'}}
                             initialRegion={initialRegion} showsUserLocation>
                        <Marker coordinate={this.state.initialCoordinates}
                                title={'Start'}/>
                    </MapView>
                    <TouchableOpacity style={styles.innerView} onPress={() => this.stopRoute()}>
                        <Text style={styles.innerButton}>Stop</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return <ActivityRunner text={"Loading Map"}/>;
    }
}

const styles = StyleSheet.create(
    // @ts-ignore
    {
        ...globalStyles,
        innerButton: {
            color: 'white',
            flex: 1,
            alignSelf: 'center',
            textAlign: 'center',
            width: '100%',
            justifyContent: 'space-between',
        },
        innerView: {
            flex: 1,
            flexDirection: 'row',
            position: 'absolute',
            bottom: 10,
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignContent: 'center',
            backgroundColor: 'black',
            borderWidth: 0.5,
            height: 75,
            width: 75,
            borderRadius: 150,
        },
    }
);
