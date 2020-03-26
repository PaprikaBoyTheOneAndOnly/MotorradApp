import React, {Component} from 'react';
import {ActivityIndicator, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {globalStyles, IPhoto, stackConfig} from '../data.module';
import {StackNavigationProp} from '@react-navigation/stack';
import {Image} from 'react-native-elements';

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    photos: IPhoto[],
    [key: string]: any,
}

export default class RoutePhotos extends Component<IProps, IState> {
    static navigationOptions = {
        ...stackConfig,
        headerTitle: 'Photos',
    };

    constructor(props) {
        super(props);
        this.state = {
            photos: this.props.navigation.getParam('photos'),
        };
    }

    openPhoto(photo: IPhoto) {
        this.props.navigation.navigate('Photo', {
            photo,
            routeName: this.props.navigation.getParam('routeName'),
        });
    }

    isErroredImage(index: number): boolean {
        return Object.keys(this.state)
            .filter((key: string) => key.includes('erroredImage'))
            .map((key: string) => Number(key.substring(key.length - 1)))
            .includes(index);
    }

    render() {
        const width = Math.round(Dimensions.get('window').width) / 100 * 31 - 2;
        const imageStyle = {width: width, height: width};
        const routePhotos = this.state.photos
            .map((photo, index) =>
                <TouchableOpacity key={index} style={styles.opacityStyle} onPress={() => this.openPhoto(photo)}>
                    <Image source={{uri: photo.url}} style={imageStyle}
                           PlaceholderContent={<ActivityIndicator/>}
                           onError={() => this.setState({...{[`erroredImage-${index}`]: null}})}/>
                </TouchableOpacity>)
            .filter((ignore, index) => !this.isErroredImage(index));

        return (
            <ScrollView style={styles.container}>
                <View style={styles.contentContainer}>
                    {routePhotos}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create(
// @ts-ignore
    {
        ...globalStyles,
        container: {
            flex: 1,
            padding: '1%',
        },
        contentContainer: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
        },
        opacityStyle: {
            margin: '1%',
        }
    }
);
