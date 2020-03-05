import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {globalStyles, ICoordinate, IRoute, staticNavigationOptions} from '../data.module';
import MapView, {Marker, Polyline} from 'react-native-maps';
import * as Firebase from '../service/FirebaseService';
import * as LocationService from '../service/LocationService';
import {StackNavigationProp} from '@react-navigation/stack';
import ActivityRunner from '../component/ActivityRunner';

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    routes: IRoute[],
    initialRegion: ICoordinate,
}

export default class Map extends Component<IProps, IState> {
    static navigationOptions = ({navigation}) => ({
        ...staticNavigationOptions(navigation)
    });

    constructor(props) {
        super(props);

        this.state = {
            routes: null,
            initialRegion: null,
        }
    }

    componentDidMount() {
        LocationService.getCurrentPosition().then((initialRegion: ICoordinate) => this.setState({initialRegion}));
        Firebase.getRoutes().then((routes) => this.setState({routes}));
        this.props.navigation.addListener('willFocus', () => {
            Firebase.getRoutes()
                .then((routes) => this.setState({routes}));
        });
    }

    render() {
        if (this.state.routes && this.state.initialRegion) {
            const initialRegion = {
                ...this.state.initialRegion,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
            };
            const polylines = this.state.routes.map((route, index) => {
                const coordinates = route.polylineCoordinates;
                coordinates.unshift(route.origin);
                coordinates.push(route.destination);
                return <Polyline key={index} coordinates={coordinates}
                                 strokeWidth={4} strokeColor={'#FCAD03'}/>
            });
            const markers = this.state.routes.map((route, index) =>
                [<Marker key={index} coordinate={route.origin} title={`Start ${route.name}`}/>,
                    <Marker key={index + 'marker2'} coordinate={route.destination} title={`End ${route.name}`}/>])
                .flat();

            return (
                <View style={{...styles.container}}>
                    <MapView style={styles.mapView} initialRegion={initialRegion}
                             showsUserLocation>
                        {polylines}
                        {markers}
                    </MapView>
                </View>
            );
        }
        return <ActivityRunner text={'Loading Routes'}/>
    }
}

const styles = StyleSheet.create(
// @ts-ignore
    {
        ...globalStyles,
        mapView: {
            flex: 1,
            width: '100%',
            height: '100%'
        }
    }
);
