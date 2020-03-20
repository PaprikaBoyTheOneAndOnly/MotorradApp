import React, {Component} from 'react';
import {Alert, AsyncStorage, StyleSheet, Text, View} from 'react-native';
import {globalStyles, IPhoto, IRoute, IStoragePhoto, Route, stackConfig} from '../data.module';
import {StackNavigationProp} from '@react-navigation/stack';
import * as Firebase from '../service/FirebaseService';
import ProgressCircle from 'react-native-progress-circle';
import * as LocationService from '../service/LocationService';
import {StackActions} from 'react-navigation';

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    route: Route,
    progress: {
        photoNumber: number;
        progress: number;
    }
}

export default class Upload extends Component<IProps, IState> {
    static navigationOptions = ({navigation}) => ({
        ...stackConfig,
        headerLeft: () => <Text/>,
    });

    constructor(props) {
        super(props);
        this.state = {
            progress: {
                progress: 0,
                photoNumber: 0,
            },
            route: this.props.navigation.getParam('route')
        };
    }

    async componentDidMount() {
        const route = this.state.route;
        const photosString = JSON.parse(await AsyncStorage.getItem(`${this.state.route.name}-PHOTOS`));

        if (photosString) {
            route.photos = await this.uploadPhotos(photosString, route);
            AsyncStorage.removeItem(`${this.state.route.name}-PHOTOS`).then();
        }

        route.destination = await LocationService.getCurrentPosition();
        //TODO calculation is not right
        route.calculateDistance();
        Firebase.saveRoute(route);
        this.props.navigation.dispatch(StackActions.replace(
            {
                routeName: 'Route',
                params: {route}
            }));
    }

    async uploadPhotos(photosString: IStoragePhoto, route: IRoute): Promise<IPhoto[]> {
        const photos: IPhoto[] = [];
        for (let i = 0; i < Object.values(photosString).length; i++) {
            const storagePhoto: IStoragePhoto = Object.values(photosString)[i];
            this.setState({
                progress: {
                    photoNumber: i + 1,
                    progress: 0,
                }
            });
            try {
                const photo: IPhoto = await Firebase.savePhoto(storagePhoto.uri, storagePhoto.name, route.name,
                    (progress) => this.setState({progress: {photoNumber: i + 1, progress}}))
                    .then(url => ({url, coordinate: storagePhoto.coordinate,}));
                photos.push(photo);
            } catch (e) {
                Alert.alert('Error', 'An error occurred while trying to upload a photo!');
            }
        }
        return photos;
    }

    render() {
        const circleProps = {
            percent: this.state.progress.progress,
            radius: 75,
            borderWidth: 8,
            color: '#3399FF',
            shadowColor: '#999',
        };

        return (
            <View style={styles.container}>
                <ProgressCircle {...circleProps}>
                    <Text>{`Uploading Photo ${this.state.progress.photoNumber}`}</Text>
                    <Text style={{fontSize: 14}}>{`${Math.round(this.state.progress.progress)}%`}</Text>
                </ProgressCircle>
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