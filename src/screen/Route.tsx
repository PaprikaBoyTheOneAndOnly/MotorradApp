import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {globalStyles, IPhoto, IRoute, stackConfig} from '../data.module';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {StackNavigationProp} from '@react-navigation/stack';
import ActivityRunner from '../component/ActivityRunner';
import {Image} from 'react-native-elements';

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    route: IRoute,
}

interface IPhotoLocation {
    lat: number,
    long: number,
    photos: IPhoto[],
}

export default class Route extends Component<IProps, IState> {
    static navigationOptions = ({navigation}) => ({
        ...stackConfig,
        headerTitle: navigation.state.params.route.name,
    });

    constructor(props) {
        super(props);
        this.state = {
            route: null,
        };
    }

    componentDidMount() {
        this.setState({route: this.props.navigation.getParam('route')});
    }

    sortPhotosByLocation(route: IRoute): IPhotoLocation[] {
        const locations: IPhotoLocation[] = [];

        route.photos.forEach(photo => {
            const photoLat = Number(photo.coordinate.latitude.toString()
                .substring(0, photo.coordinate.latitude.toString().indexOf('.') + 5));
            const photoLong = Number(photo.coordinate.longitude.toString()
                .substring(0, photo.coordinate.longitude.toString().indexOf('.') + 5));
            const foundLocation = locations.find(loc => {
                const latDiff = Math.round((loc.lat > photoLat ? loc.lat - photoLat : photoLat - loc.lat) * 10000) / 10000;
                const longDiff = Math.round((loc.long > photoLong ? loc.long - photoLong : photoLong - loc.long) * 10000) / 10000;
                return latDiff <= 0.001 && longDiff <= 0.001;
            });

            if (foundLocation) {
                foundLocation.photos.push(photo);
            } else {
                locations.push({
                    lat: photoLat,
                    long: photoLong,
                    photos: [photo],
                });
            }
        });
        return locations;
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

            let photoMarkers;
            //mock
            route.photos = [{
                url: 'https://i.pinimg.com/originals/22/fd/29/22fd2937158488665960e6ce771aea98.jpg',
                coordinate: {
                    latitude: 47.499364083677065,
                    longitude: 8.720588805162087,
                }
            },
                {
                    url: 'https://reactnativecode.com/wp-content/uploads/2017/05/react_thumb_install.png',
                    coordinate: {
                        latitude: 47.500100936784875,
                        longitude: 8.722682688393371,
                    }
                }];
            if (route.photos && route.photos.length > 0) {
                photoMarkers = this.sortPhotosByLocation(route).map((location, index) =>
                    <Marker key={index} coordinate={{latitude: location.lat, longitude: location.long}}
                            onPress={() => this.props.navigation.navigate('RoutePhotos', {photos: location.photos})}>
                        <Image source={{uri: location.photos[0].url}} style={styles.image}
                               PlaceholderContent={<ActivityIndicator/>}/>
                    </Marker>
                );
            }

            return (
                <View style={{...styles.container}}>
                    <MapView style={styles.mapView} initialRegion={initialRegion}
                             showsUserLocation>
                        <Marker coordinate={route.origin} title={`Start ${route.name}`}/>
                        <Polyline coordinates={coordinates} strokeWidth={4}
                                  strokeColor={'#FCAD03'}/>
                        <Marker coordinate={route.destination} title={`End ${route.name}`}/>
                        {photoMarkers}
                    </MapView>
                </View>
            );
        }
        return <ActivityRunner text={'Loading Route'}/>;
    }
}

const styles = StyleSheet.create(
// @ts-ignore
    {
        ...globalStyles,
        mapView: {
            flex: 1,
            width: '100%',
            height: '100%',
        },
        image: {
            width: 75,
            height: 75,
        }
    }
);
