import React from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Form, Image,
    KeyboardAvoidingView
} from 'react-native';
import {TextInput, Button, Title, HelperText} from 'react-native-paper';
import {Icon} from 'expo';
import {Header} from 'react-navigation';
import axios from 'axios';
import guideStore from "../stores/GuideStore";

export default class RegisterScreen extends React.Component {

    state = {
        registerName: '',
        registerEmail: '',
        registerPassword:'',
        registerPhone:'',
        registerBio:'',
        registerErrorMessage:'',
    };

    static navigationOptions = {
        title: null,
    };

    _login(email, password){
        let me = this;
        if(email == '' || password == '') {
            me.setState({registerErrorMessage: 'Please fill the required fields'});
            return;
        }

        axios.post('/guide/login',
            {email:email, password: password})
            .then((resp) => {
                //Put user in store
                guideStore.login(resp.data);
                // Navigate to dashboard;
                me.props.navigation.navigate('Main');
            })
            .catch((err) => {
                me.setState({ registerErrorMessage: 'Invalid credentials provided' });
                console.log(err);
            });
    }

    _register(name, email, password, phone, bio){
        let me = this;
        if(email == '' || password == '' || name == '' || phone == '' || bio == '') {
            me.setState({registerErrorMessage: 'Please fill the required fields'});
            return;
        }

        if(password.length < 6){
            me.setState({registerErrorMessage: 'Password should be at least 6 characters'});
            return;
        }

        axios.post('/guide/register',
            {name:name, email:email, password: password, phone:phone, bio:bio})
            .then((resp) => {
                //Login user
                me._login(email, password);
            })
            .catch((err) => {
                me.setState({ registerErrorMessage: 'Email already registered' });
                console.log(err);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset = {Header.HEIGHT-45} enabled>
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
                                    <Title style={{fontSize:24}}>Register</Title>
                                </View>
                                <TextInput
                                    label='Name'
                                    value={this.state.registerName}
                                    onChangeText={name => this.setState({ registerName: name })}
                                    style={styles.textInput}
                                />
                                <TextInput
                                    label='Email'
                                    value={this.state.registerEmail}
                                    onChangeText={email => this.setState({ registerEmail: email })}
                                    style={styles.textInput}
                                />
                                <TextInput
                                    label='Password'
                                    value={this.state.registerPassword}
                                    secureTextEntry={true}
                                    onChangeText={password => this.setState({ registerPassword: password })}
                                    style={styles.textInput}
                                />
                                <TextInput
                                    label='Phone'
                                    value={this.state.registerPhone}
                                    onChangeText={phone => this.setState({ registerPhone: phone })}
                                    style={styles.textInput}
                                />
                                <TextInput
                                    label='Bio'
                                    multiline={true}
                                    value={this.state.bio}
                                    onChangeText={bio=> this.setState({ registerBio: bio})}
                                    style={styles.textInput}
                                />
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {this._register(this.state.registerName, this.state.registerEmail, this.state.registerPassword,
                                        this.state.registerPhone, this.state.registerBio)}}>
                                    <Button mode="contained"
                                            style={styles.buttonLogin}>
                                        Register
                                    </Button>
                                </TouchableOpacity>
                                <View style={{paddingTop:10, paddingBottom:25, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                                    <HelperText
                                        type="error"
                                        visible={!(this.state.registerErrorMessage=='')}
                                        style={{fontSize:14}}>
                                        <Icon.Ionicons name="md-alert" size={14}/> {this.state.registerErrorMessage}
                                    </HelperText>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
        marginTop: 40,
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
        justifyContent: 'center',
    },
    welcomeImage: {
        flex:1,
        height:65,
        flexDirection: 'row',
        resizeMode: 'contain',
    },
});
