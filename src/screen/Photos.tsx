import React, {Component} from 'react';
import {ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {globalStyles, IPhoto, IRoute, staticNavigationOptions} from '../data.module';
import {StackNavigationProp} from "@react-navigation/stack";
import * as Firebase from "../service/FirebaseService";
import ActivityRunner from "../component/ActivityRunner";
import {Image} from "react-native-elements";

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    routes: IRoute[],
    routesLoaded: boolean,
}

export default class Photos extends Component<IProps, IState> {
    static navigationOptions = ({navigation}) => ({
        ...staticNavigationOptions(navigation)
    });

    constructor(props) {
        super(props);
        this.state = {
            routes: [],
            routesLoaded: false,
        };
    }

    componentDidMount() {
        Firebase.getRoutes().then((routes) => this.setState({routes, routesLoaded: true}));
    }

    openPhotos(photos: IPhoto[]) {
        this.props.navigation.navigate('RoutePhotos', {
            photos,
        });
    }

    render() {
        if (this.state.routesLoaded) {
            const width = Math.round(Dimensions.get('window').width) - 20;
            const photos = this.state.routes
                .filter(route => route.photos && route.photos.length > 0)
                .map(({photos, name}, index) =>
                    <TouchableOpacity onPress={() => this.openPhotos(photos)}>
                        <Image key={index} source={{uri: photos[0].url}} style={{
                            width: width / 3,
                            height: width / 3,
                            marginBottom: 5
                        }} PlaceholderContent={<ActivityIndicator/>}/>
                        <Text style={{color: 'grey', textAlign:'center'}}>{name}</Text>
                    </TouchableOpacity>);

            return (
                <ScrollView style={styles.container}>
                    <View style={styles.contentContainer}>
                        {photos}
                    </View>
                </ScrollView>
            );
        }

        return <ActivityRunner text={'Loading photos'}/>;
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
