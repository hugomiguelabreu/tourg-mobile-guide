import React from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Form, Image
} from 'react-native';
import {Header} from 'react-navigation';
import {TextInput, Button, Title, HelperText} from 'react-native-paper';
import guideStore from '../stores/GuideStore';
import {Icon} from 'expo';
import axios from 'axios';

export default class LoginScreen extends React.Component {

    state = {
        loginEmail: 'k@mail.com',
        loginPassword: '123456',
        loginErrorMessage:'',
    };

    static navigationOptions = {
        title: null,
    };

    _login(email, password){
        let me = this;
        if(email == '' || password == '') {
            me.setState({loginErrorMessage: 'Please fill the required fields'});
            return;
        }

        axios.post('/guide/login',
            {email:email, password: password})
            .then((resp) => {
                //Put user in store
                console.log(resp.data);
                guideStore.login(resp.data);
                // Navigate to dashboard;
                me.props.navigation.navigate('Main');
            })
            .catch((err) => {
                me.setState({ loginErrorMessage: 'Invalid credentials provided' });
                console.log(err);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset = {Header.HEIGHT - 150} enabled>
                    <ScrollView style={styles.contentContainer} contentContainerStyle={{flexGrow:1}}>
                        <View style={styles.imageView}>
                            <Image
                                source={
                                    require('../assets/images/tour-white.png')
                                }
                                style={styles.welcomeImage}
                            />
                        </View>
                        <View style={styles.welcomeContainer}>
                            <View style={styles.loginView}>
                                <View style={{flexDirection:'row', justifyContent: 'flex-start'}}>
                                    <Title style={{fontSize:24}}>Login</Title>
                                </View>
                                <TextInput
                                    label='Email'
                                    value={this.state.loginEmail}
                                    onChangeText={email => this.setState({ loginEmail: email })}
                                    style={styles.textInput}
                                />
                                <TextInput
                                    label='Password'
                                    value={this.state.loginPassword}
                                    secureTextEntry={true}
                                    onChangeText={password => this.setState({ loginPassword: password })}
                                    style={styles.textInput}
                                />
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {this._login(this.state.loginEmail, this.state.loginPassword)}}>
                                    <Button mode="contained"
                                            style={styles.buttonLogin}>
                                        Login
                                    </Button>
                                </TouchableOpacity>
                                <View style={{paddingTop:10, paddingBottom:15, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                                    <HelperText
                                        type="error"
                                        visible={!(this.state.loginErrorMessage == '')}
                                        style={{fontSize:14}}>
                                        <Icon.Ionicons name="md-alert" size={14}/> {this.state.loginErrorMessage}
                                    </HelperText>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Register')}
                    style={styles.button}>
                    <Button mode="contained"
                            style={styles.buttonLogin}>
                        Register
                    </Button>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#349D88',
    },
    contentContainer: {
        flex:1,
        paddingTop: 30,
    },
    buttonLogin:{
        padding:10,
    },
    textInput:{
        marginBottom: 25,
        backgroundColor:'transparent',
    },
    welcomeContainer: {
      flex: 1,
      flexDirection: 'column',
      marginTop: 10,
      marginBottom: 20,
      marginLeft: 45,
      marginRight: 45,
    },
    imageView:{
        flex:1,
        flexDirection:'row',
        marginTop:30,
    },
    loginView:{
        flex:4,
        flexDirection:'column',
    },
    welcomeImage: {
        flex:1,
        height:65,
        flexDirection: 'row',
        resizeMode: 'contain',
    },
});
