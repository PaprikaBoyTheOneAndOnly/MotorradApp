import React, {Component} from 'react';
import {Dimensions, StyleSheet, Text, View, Image as NativeImage} from 'react-native';
import {globalStyles, IPhoto, stackConfig} from '../data.module';
import {StackNavigationProp} from "@react-navigation/stack";
import {Image} from "react-native-elements";
import ActivityRunner from "../component/ActivityRunner";

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    photo: IPhoto,
    width: number,
    height: number,
}

export default class Photo extends Component<IProps, IState> {
    static navigationOptions = {
        ...stackConfig
    };

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
        if (this.state.height) {
            const width = Dimensions.get('window').width;
            const ratio = width / this.state.width;

            return (
                <View style={{...styles.container, backgroundColor: 'black'}}>
                    <Image source={{uri: this.state.photo.url}}
                           style={{
                               width: width,
                               height: this.state.height * ratio,
                           }}/>
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
