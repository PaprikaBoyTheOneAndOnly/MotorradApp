import React, {Component} from "react";
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import {globalStyles} from "../data.module";

interface IProps {
    text: string
}
export default class ActivityRunner extends Component<IProps,{}> {
    render() {
       return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#000000"/>
            <Text>{`\n${this.props.text}`}</Text>
        </View>)
    }
}

const styles = StyleSheet.create(
// @ts-ignore
    {
        ...globalStyles,
    }
);
