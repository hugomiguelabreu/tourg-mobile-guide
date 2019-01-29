import React from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Form, Image, TouchableNativeFeedback
} from 'react-native';
import {List, Colors, Title, Snackbar, Divider, Subheading} from 'react-native-paper';
import {Icon} from 'expo';
import guideStore from "../../stores/GuideStore";
import axios from "axios";
import LoadingModal from "../../components/LoadingModal";

export default class MyPayments extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            info:false,
            balance: 0
        }
    }

    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        // When the screen is focused again let's fetch new results
        this.props.navigation.addListener(
            'willFocus',
            payload => {
                this.setState({info: true});
                this._getBalance();
            }
        );
    }

    _getBalance() {
        let me = this;
        this.setState({isLoading: true});
        axios.get('/guide/balance')
            .then((resp) => {
                me.setState({
                    balance: resp.data.balance,
                    isLoading:false
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        if(!this.state.isLoading) {

            return (
                <View style={styles.container}>
                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                        <View style={styles.welcomeContainer}>
                            <View style={styles.profile}>
                                <List.Section title="Wallet">
                                    <List.Item
                                        title='Withdraw available'
                                        description={this.state.balance + '€'}
                                        left={() => <List.Icon icon={() => <Icon.FontAwesome name='euro' size={24}/>}/>}
                                        onPress={() => {
                                            this.setState({info: true})
                                        }}
                                    />
                                </List.Section>
                                <Divider/>
                                <List.Section title="Deposit Bank Account">
                                    <List.Item
                                        title={guideStore.iban}
                                        description={guideStore.swift}
                                        left={() => <List.Icon
                                            icon={() => <Icon.FontAwesome name='university' size={24}/>}/>}
                                        onPress={() => {
                                            this.setState({info: true})
                                        }}
                                    />
                                </List.Section>
                            </View>
                        </View>
                    </ScrollView>
                    <Snackbar
                        visible={this.state.info}
                        style={{backgroundColor: 'white'}}
                        duration={15000}
                        onDismiss={() => {
                            this.setState({info: false});
                        }}
                        action={{
                            label: 'Dismiss',
                            onPress: () => {
                                this.setState({info: false});
                            },
                        }}>
                        <Icon.Ionicons
                            name='md-alert'
                            style={{color: 'grey'}}
                            size={16}
                        />
                        &nbsp;
                        &nbsp;
                        <Text style={{color: 'black'}}>To manage payments, visit the website.</Text>
                    </Snackbar>
                </View>
            );
        }else{
            return(
                <LoadingModal/>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow:1,
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
        marginLeft: 15,
        marginRight: 15,
    },
    profile:{
        flex:1,
        flexDirection:'column',
    },
});
