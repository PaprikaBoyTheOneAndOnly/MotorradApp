import React, {Component} from 'react';
import {Alert, Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import {globalStyles} from '../data.module';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackActions} from 'react-navigation';
import * as Firebase from '../service/FirebaseService';
import {Button} from 'react-native-elements';

interface IProps {
    navigation: StackNavigationProp<any>;
}

interface IState {
    email: string,
    emailLengthError: string,
    password: string,
    passwordLengthError: string,
    failedMsg: string,
}

export default class Login extends Component<IProps, IState> {
    private loginPressed = false;

    constructor(props) {
        super(props);
        //TODO: Safe userdata in asyncstorage and log in automatically to be more user friendly
        this.state = {
            email: null,
            password: null,
            emailLengthError: '',
            passwordLengthError: '',
            failedMsg: '',
        };
    }

    private validInputs(): boolean {
        let err = true;

        if (!this.state.email || this.state.email.length < 5) {
            this.setState({emailLengthError: 'Email must be at least 5 characters'});
            err = false;
        } else {
            this.setState({emailLengthError: ''});
        }

        if (!this.state.password || this.state.password.length < 5) {
            this.setState({passwordLengthError: 'Password must be at least 5 characters'});
            err = false;
        } else {
            this.setState({passwordLengthError: ''});
        }

        return err;
    }

    relocate() {
        this.props.navigation.dispatch(StackActions.replace(
            {
                routeName: 'MainStack',
            }));
    }

    tryToLogin = async () => {
        Keyboard.dismiss();
        if (!this.loginPressed && this.validInputs()) {
            this.loginPressed = true;
            try {
                await Firebase.login(this.state.email, this.state.password);
                this.relocate();
                this.loginPressed = false;
            } catch (err) {
                this.loginPressed = false;
                this.setState({failedMsg: err.message});
            }
        }
    };

    tryToSignUp = () => {
        if (this.validInputs()) {
            Alert.alert('Sign In',
                `Do you really want to create an account with "${this.state.email}"`, [
                    {
                        text: 'Ok',
                        onPress: () => {
                            Firebase.signUp(this.state.email, this.state.password)
                                .then(() => this.relocate())
                                .catch(err => {
                                    Keyboard.dismiss();
                                    this.setState({failedMsg: err.message});
                                })
                        }
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
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{this.state.emailLengthError}</Text>
                </View>
                <TextInput style={styles.input} value={this.state.password}
                           placeholder={'Password'}
                           secureTextEntry
                           onChangeText={(password) => this.setState({password})}/>
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{this.state.passwordLengthError}</Text>
                </View>
                <View style={styles.errorBox}>
                    <Text style={styles.errorText} numberOfLines={2}>{this.state.failedMsg}</Text>
                </View>
                <Button style={styles.button} onPress={this.tryToLogin} title={'Login'}/>
                <Button style={styles.button} onPress={this.tryToSignUp} title={'SignUp'} type={'outline'}/>
            </View>
        );
    }
}

const styles = StyleSheet.create(
// @ts-ignore
    {
        ...globalStyles,
        button: {
            width: 100,
            margin: 5,
        },
    }
);
