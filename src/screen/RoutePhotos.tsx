import React, {Component} from 'react';
import {ActivityIndicator, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {globalStyles, IPhoto, stackConfig} from '../data.module';
import {StackNavigationProp} from '@react-navigation/stack';
import {Image} from 'react-native-elements';

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    photos: IPhoto[],
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
            photo
        });
    }

    render() {
        const width = Math.round(Dimensions.get('window').width) - 20;
        const imageStyle = {
            width: width / 3,
            height: width / 3,
            marginBottom: 5
        };
        const photos = this.state.photos.map((photo, index) =>
            <TouchableOpacity key={index} onPress={() => this.openPhoto(photo)}>
                <Image source={{uri: photo.url}} style={imageStyle} PlaceholderContent={<ActivityIndicator/>}/>
            </TouchableOpacity>
        );

        return (
            <ScrollView style={styles.container}>
                <View style={styles.contentContainer}>
                    {photos}
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
            width: '100%',
            height: '100%',
            padding: 5
        },
        contentContainer: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
    }
);
