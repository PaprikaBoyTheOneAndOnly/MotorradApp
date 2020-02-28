import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {globalStyles, IRoute, stackConfig} from '../data.module';
import MapView, {Polyline} from 'react-native-maps';
import {StackNavigationProp} from '@react-navigation/stack';
import ActivityRunner from "./ActivityRunner";

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    route: IRoute,
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
                <View style={{...styles.container}}>
                    <MapView style={styles.mapView} initialRegion={initialRegion}
                             showsUserLocation>
                        <Polyline coordinates={coordinates} strokeWidth={4}
                                  strokeColor={'#FCAD03'}/>
                    </MapView>
                </View>
            );
        }
        return <ActivityRunner text={"Loading Route"}/>;
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
