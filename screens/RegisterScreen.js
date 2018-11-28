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
import {TextInput, Button, Title, Divider} from 'react-native-paper';

export default class RegisterScreen extends React.Component {

    state = {
      email: '',
      password: '',
    };

    static navigationOptions = {
        title: null,
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.welcomeContainer}>
                    <View style={styles.imageView}>
                        <Image
                            source={
                                require('../assets/images/tour-white.png')
                            }
                            style={styles.welcomeImage}
                        />
                    </View>
                    <View style={styles.loginView}>
                        <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={260}>
                        <ScrollView style={styles.scrollContainer} contentContainerStyle={{flexGrow:1}}>
                            <View style={{flexDirection:'row', justifyContent: 'center'}}>
                                <Title style={{fontSize:32}}>Register</Title>
                            </View>
                            <TextInput
                                label='Full Name'
                                value={this.state.email}
                                onChangeText={email => this.setState({ email: email })}
                                style={styles.textInput}
                            />
                            <TextInput
                                label='Email'
                                value={this.state.email}
                                onChangeText={email => this.setState({ email: email })}
                                style={styles.textInput}
                            />
                            <TextInput
                                label='Password'
                                value={this.state.password}
                                secureTextEntry={true}
                                onChangeText={password=> this.setState({ password: password })}
                                style={styles.textInput}
                            />
                            <TextInput
                                label='Date of birth'
                                value={this.state.email}
                                onChangeText={email => this.setState({ email: email })}
                                style={styles.textInput}
                            />
                            <TextInput
                                label='Government issued card number'
                                value={this.state.email}
                                onChangeText={email => this.setState({ email: email })}
                                style={styles.textInput}
                            />
                            <TextInput
                                label='City'
                                value={this.state.email}
                                onChangeText={email => this.setState({ email: email })}
                                style={styles.textInput}
                            />
                            <TextInput
                                multiline={true}
                                label='Biography'
                                value={this.state.email}
                                onChangeText={email => this.setState({ email: email })}
                                style={styles.textInput}
                            />
                            <Divider/>
                            <TouchableOpacity
                                onPress={this.props.onLoginPress}
                                style={styles.button}>
                                <Button mode="contained" onPress={() => this.props.navigation.navigate('Register')}
                                        style={styles.buttonLogin}>
                                    Apply
                                </Button>
                            </TouchableOpacity>
                        </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#349D88',
    },
    scrollContainer: {
        flex:1,
        flexDirection:'column',
        paddingLeft: 45,
        paddingRight: 45,
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
        paddingTop: 30,
        marginTop: 10,
        marginBottom: 20,
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
