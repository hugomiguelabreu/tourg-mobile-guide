import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Form
} from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { MonoText } from '../components/StyledText';

export default class LoginScreen extends React.Component {

  state = {
      email: '',
      password: '',
  };

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.welcomeContainer}>
                <Title>Login</Title>
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
                <TouchableOpacity
                    onPress={this.props.onLoginPress}
                    style={styles.button}>
                    <Button mode="contained" onPress={() => console.log('Pressed')}
                            style={styles.buttonLogin}>
                        Login
                    </Button>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
      alignItems: 'stretch',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 20,
      marginLeft: 45,
      marginRight: 45,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
