import React, {Component} from 'react';
import {ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {globalStyles, IPhoto, IRoute, staticNavigationOptions} from '../data.module';
import {StackNavigationProp} from '@react-navigation/stack';
import * as Firebase from '../service/FirebaseService';
import ActivityRunner from '../component/ActivityRunner';
import {Image} from 'react-native-elements';

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
        Firebase.onRoutes((routes) => this.setState({routes, routesLoaded: true}));
    }

    openPhotos(photos: IPhoto[], routeName) {
        this.props.navigation.navigate('RoutePhotos', {
            photos,
            routeName,
        });
    }

    render() {
        if (this.state.routesLoaded) {
            const width = Math.round(Dimensions.get('window').width) / 100 * 31 - 2;
            const imageStyle = {width: width, height: width};
            const photos = this.state.routes
                .filter(route => route.photos && route.photos.length > 0)
                .map(({photos, name}, index) =>
                    <TouchableOpacity key={index} style={styles.opacityStyle} onPress={() => this.openPhotos(photos, name)}>
                        <Image source={{uri: photos[0].url}} style={imageStyle}
                               PlaceholderContent={<ActivityIndicator/>}/>
                        <Text style={styles.text}>{name}</Text>
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
            justifyContent: 'flex-start',
        },
        text: {
            color: 'grey',
            marginTop: 5,
            textAlign: 'center',
        },
        opacityStyle: {
            margin: '1%',
        }
    }
);
