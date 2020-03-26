import React, {Component} from 'react';
import {Dimensions, Image as NativeImage, StyleSheet, TouchableOpacity, View, Text, Alert} from 'react-native';
import {globalStyles, IPhoto, stackConfig} from '../data.module';
import {StackNavigationProp} from '@react-navigation/stack';
import {Image} from 'react-native-elements';
import ActivityRunner from '../component/ActivityRunner';
import * as FirebaseService from '../service/FirebaseService';
import {extractNameOfPhoto} from '../service/FirebaseService';

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    photo: IPhoto,
    width: number,
    height: number,
}

export default class Photo extends Component<IProps, IState> {
    static navigationOptions = ({navigation}) => ({
        ...stackConfig,
        headerTitle: 'Photo',
        headerRight: () => {
            const onPressDelete = () =>
                FirebaseService.deletePhoto(navigation.state.params.routeName,
                    extractNameOfPhoto(navigation.state.params.photo.url))
                    .then(() => navigation.goBack())
                    .catch(() => Alert.alert('Error', 'Could not delete photo!' +
                        '\nPlease try again later.'));

            return (
                <TouchableOpacity style={{marginRight: 20}} onPress={onPressDelete}>
                    <Text style={{color: 'red'}}>Delete</Text>
                </TouchableOpacity>
            );
        }
    });

    constructor(props) {
        super(props);
        this.state = {
            photo: this.props.navigation.getParam('photo'),
            width: null,
            height: null,
        };
    }

    componentDidMount() {
        NativeImage.getSize(this.state.photo.url, (width, height) =>
            this.setState({width, height}), null);
    }

    render() {
        if (this.state.height && this.state.width) {
            const width = Dimensions.get('window').width;
            const ratio = width / this.state.width;
            const style = {
                width: width,
                height: this.state.height * ratio,
            };

            return (
                <View style={{...styles.container, backgroundColor: 'black'}}>
                    <Image source={{uri: this.state.photo.url}} style={style}/>
                </View>
            );
        }
        return <ActivityRunner text={'Waiting for image'}/>
    }
}

const styles = StyleSheet.create(
// @ts-ignore
    {
        ...globalStyles,
    }
);
