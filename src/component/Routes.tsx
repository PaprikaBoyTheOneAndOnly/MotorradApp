import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import * as Firebase from '../service/FirebaseService';
import {StackNavigationProp} from '@react-navigation/stack';
import {globalStyles, IRoute} from '../data.module';
import {ListItem} from 'react-native-elements';
import ActivityRunner from "./ActivityRunner";

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    routes: IRoute[],
    routesLoaded: boolean,
}

export default class Routes extends Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            routes: [],
            routesLoaded: false,
        }
    }

    componentDidMount() {
        Firebase.getRoutes().then((routes) => this.setState({routes, routesLoaded: true}));
        this.props.navigation.addListener('willFocus', () => {
            Firebase.getRoutes()
                .then((routes) => this.setState({routes, routesLoaded: true}));
        });
    }

    openRoute = (route) => {
        this.props.navigation.navigate('Route', {route})
    };

    renderRouteItem = ({item, index}) => {
        return <ListItem key={index}
                         style={styles.itemStyle}
                         containerStyle={styles.itemContainerStyle}
                         chevron title={item.name}
                         subtitle={`${Math.round(item.distance * 1000)} km`}
                         subtitleStyle={{opacity: 0.3}}
                         onPress={() => this.openRoute(item)}
                         underlayColor={'rgba(0,0,0,0.2)'}/>
    };

    render() {
        if (!this.state.routesLoaded) {
            return <ActivityRunner text={"Loading Routes"}/>;
        }
        return (
            <View style={styles.container}>
                <FlatList style={{width: '100%', height: '100%'}}
                          data={this.state.routes}
                          keyExtractor={(item, index) => String(index)}
                          renderItem={this.renderRouteItem}/>
            </View>
        );
    }
}

const styles = StyleSheet.create(
    // @ts-ignore
    {
        ...globalStyles,
        itemStyle: {
            height: 70, width: '100%',
            backgroundColor: 'rgba(0,0,0,0.0)',
        },
        itemContainerStyle: {
            backgroundColor: 'rgba(0,0,0,0.0)',
            borderBottomWidth: 2,
            borderBottomColor: 'rgba(0,0,0,0.2)',
            margin: 10
        }

    }
);
