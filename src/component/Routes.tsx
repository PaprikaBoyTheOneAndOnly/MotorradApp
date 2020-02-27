import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as Firebase from '../service/FirebaseService';
import {StackNavigationProp} from "@react-navigation/stack";
import {IRoute} from "../data.module";

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    routes: IRoute[],
}

export default class Routes extends Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            routes: [],
        }
    }

    componentDidMount() {
        Firebase.getRoutes().then((routes) => this.saveRoutes(routes));
        this.props.navigation.addListener('willFocus',
            () => Firebase.getRoutes().then((routes) => this.saveRoutes(routes)))
    }

    saveRoutes(routes) {
        this.setState({routes})
    }

    render() {
        const routes = this.state.routes.map((route, i) => <Text key={i}>{route.name}</Text>)
        return (
            <View style={styles.container}>
                <Text>Routes Screen works!</Text>
                {routes}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
