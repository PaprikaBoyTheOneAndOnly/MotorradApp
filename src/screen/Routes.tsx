import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as Firebase from '../service/FirebaseService';
import {extractKeys} from '../service/FirebaseService';
import {StackNavigationProp} from '@react-navigation/stack';
import {globalStyles, IRoute, IRouteKey, staticNavigationOptions} from '../data.module';
import {ListItem} from 'react-native-elements';
import ActivityRunner from '../component/ActivityRunner';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    routes: IRouteKey[],
    routesLoaded: boolean,
    rowsOpen: boolean,
}

export default class Routes extends Component<IProps, IState> {
    static navigationOptions = ({navigation}) => ({
        ...staticNavigationOptions(navigation)
    });

    constructor(props) {
        super(props);
        this.state = {
            routes: [],
            routesLoaded: false,
            rowsOpen: false,
        }
    }

    componentDidMount() {
        this.loadRoutes();
        this.props.navigation.addListener('willFocus', () => this.loadRoutes());
    }

    loadRoutes() {
        Firebase.getRoutesWithKey()
            .then((routes) => this.setState({routes, routesLoaded: true}));
    }

    openRoute = (route) => {
        if (!this.state.rowsOpen) {
            this.props.navigation.navigate('Route', {route})
        }
    };

    deleteRoute = (route) => {
        Firebase.deleteRoute(route)
            .then(() => this.loadRoutes());
    };

    renderRouteItem = ({item, index}, rowMap) => {
        const route: IRoute = extractKeys([item])[0];
        const swipeRowProps = {
            key: index,
            style: styles.itemStyle,
            disableRightSwipe: true,
            stopRightSwipe: -100,
            rightOpenValue: -100,
            swipeToOpenPercent: 10
        };
        const listItemProps = {
            containerStyle: styles.itemContainerStyle,
            chevron: true, title: route.name,
            subtitle: `${Math.round(route.distance * 1000)} km`,
            subtitleStyle: {opacity: 0.3},
            onPress: () => this.openRoute(route),
        };

        return (
            <SwipeRow {...swipeRowProps}>
                <TouchableOpacity style={styles.hiddenItem}
                                  onPress={() => {
                                      rowMap[index].closeRow();
                                      this.deleteRoute(Object.keys(item)[0]);
                                  }}>
                    <Text style={{color: 'white', fontSize: 20,}}>
                        Delete
                    </Text>
                </TouchableOpacity>
                <ListItem {...listItemProps}/>
            </SwipeRow>);
    };

    render() {
        if (!this.state.routesLoaded) {
            return <ActivityRunner text={'Loading Routes'}/>;
        }

        if (this.state.routes.length === 0) {
            return (
                <View style={styles.container}>
                    <Text>You have not saved a route yet</Text>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <SwipeListView style={{width: '100%', height: '100%'}}
                               useFlatList
                               closeOnRowBeginSwipe
                               data={this.state.routes}
                               keyExtractor={(item, index) => String(index)}
                               renderItem={this.renderRouteItem}
                               onRowOpen={() => this.setState({rowsOpen: true})}
                               onRowClose={() => this.setState({rowsOpen: false})}/>
            </View>
        );
    }
}

const styles = StyleSheet.create(
    // @ts-ignore
    {
        ...globalStyles,
        itemStyle: {
            height: 70,
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.0)',
            borderBottomWidth: 2,
            borderBottomColor: 'rgba(0,0,0,0.2)',
        },
        itemContainerStyle: {
            backgroundColor: 'white',
        },
        hiddenItem: {
            backgroundColor: 'red',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingRight: 20
        }
    }
);
