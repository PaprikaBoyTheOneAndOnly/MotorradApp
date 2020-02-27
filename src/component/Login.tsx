import React, {Component} from 'react';
import {StyleSheet, View, Text, Button, TextInput, Alert, AsyncStorage} from 'react-native';
import {globalStyles} from '../data.module';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackActions} from "react-navigation";
import * as Firebase from '../service/FirebaseService';

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    email: string,
    emailLengthError: boolean,
    password: string,
    passwordLengthError: boolean,
    failedMsg: string,
}

export default class Login extends Component<IProps, IState> {
    constructor(props) {
        super(props);
        //TODO: Safe userdata in asyncstorage and log in automatically to be more user friendly
        this.state = {
            email: null,
            password: null,
            emailLengthError: false,
            passwordLengthError: false,
            failedMsg: null,
        };
    }

    private validInputs(): boolean {
        if (!this.state.email || this.state.email.length < 5) {
            this.setState({emailLengthError: true});
            return false;
        } else if (!this.state.password || this.state.password.length < 5) {
            this.setState({passwordLengthError: true});
            return false;
        }
        return true;
    }

    relocate() {
        this.props.navigation.dispatch(StackActions.replace(
            {
                routeName: 'MainStack',
            }));
    }

    tryToLogin = () => {
        if (this.validInputs()) {
            Firebase.login(this.state.email, this.state.password)
                .then(() => this.relocate())
                .catch(err => this.setState({failedMsg: err.message}));
        }
    };

    tryToSignIn = () => {
        if (this.validInputs()) {
            Alert.alert("Sign In",
                `Do you really want to create an account with "${this.state.email}"`,
                [
                    {
                        text: 'Ok',
                        onPress: () => Firebase.signUp(this.state.email, this.state.password)
                            .then(() => this.relocate())
                            .catch(err => this.setState({failedMsg: err.message}))
                    },
                    {
                        text: 'No',
                        style: 'cancel',
                    },
                ]);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <TextInput style={styles.input} value={this.state.email}
                           placeholder={'Email'}
                           onChangeText={(email) => this.setState({email})}/>
                {this.state.emailLengthError &&
                <Text style={styles.errorText}>Email must be at least 5 characters</Text>}
                <TextInput style={styles.input} value={this.state.password}
                           placeholder={'Password'}
                           secureTextEntry
                           onChangeText={(password) => this.setState({password})}/>
                {this.state.passwordLengthError &&
                <Text style={styles.errorText}>Password must be at least 5 characters</Text>}
                <Button onPress={this.tryToLogin} title={'Login'}/>
                <Button onPress={this.tryToSignIn} title={'SignUp'}/>
                {this.state.failedMsg &&
                <Text style={styles.errorText}>{this.state.failedMsg}</Text>}
            </View>
        );
    }
}
const styles = StyleSheet.create(
    // @ts-ignore
    {
        ...globalStyles,
    });
