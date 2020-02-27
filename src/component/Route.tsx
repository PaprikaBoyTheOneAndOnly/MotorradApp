import React, { Component } from 'react';
import { AsyncStorage, Text, View } from 'react-native';
import { IRoute, stackConfig, StorageKey } from '../data.module';
import MapView, { Polyline } from 'react-native-maps';
import { NavigationActions, StackActions } from 'react-navigation';
import {StackNavigationProp} from "@react-navigation/stack";

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    route: IRoute,
}

export default class Route extends Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            route: null,
        };
    }

    componentDidMount() {
        this.setState({route: this.props.navigation.getParam('route')});
    }

    componentWillUnmount() {

    }

    render() {
        const route = this.state.route;
        if (route) {
            const initialRegion = {
                longitude: route.origin.longitude,
                latitude: route.origin.latitude,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
            };
            const coordinates = route.polylineCoordinates;
            coordinates.unshift(route.origin);
            coordinates.push(route.destination);

            return (
                <View style={{flex: 1}}>
                    <MapView style={{flex: 1}} initialRegion={initialRegion} showsUserLocation>
                        <Polyline coordinates={route.polylineCoordinates} strokeWidth={4}
                                  strokeColor={'#FCAD03'}/>
                    </MapView>
                </View>
            );
        }
        return (<Text>Loading</Text>);
    }
}
