import React, {Component} from 'react';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import {StackNavigationProp} from '@react-navigation/stack';

interface IProps {
    navigation: StackNavigationProp<any>;
}

export default class HamburgerMenu extends Component<IProps, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{left: 10}}>
                <Icon name={'menu'} color={'white'}
                      onPress={() => this.props.navigation.openDrawer()}/>
            </View>
        );
    }
}
