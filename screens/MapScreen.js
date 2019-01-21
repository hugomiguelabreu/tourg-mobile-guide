import React from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Alert,
    Dimensions,
    View,
    Form, Image,
    Modal,
    AsyncStorage, KeyboardAvoidingView, Text, TouchableNativeFeedback
} from 'react-native';
import {TextInput, Button, Title, HelperText, Divider, Card} from 'react-native-paper';
import axios from 'axios';
import {Icon, Constants} from 'expo';
import {Header} from 'react-navigation';
import MapView, {AnimatedRegion, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewAnimated from 'react-native-maps';

export default class MapScreen extends React.Component {

    moment = require('moment');

    constructor(props){
        super(props);
        this.onRegionChange = this.onRegionChange.bind(this);
        this.state = {
        };
    }

    static navigationOptions = {
        headerTitle: <View style={{flex:1, alignItems:'center', justifyContent:'center'}}><Title>TOUR VIEW</Title></View>,
        headerLeft: null,
        headerStyle: {
            marginTop: -Constants.statusBarHeight,
        }
    };

    componentDidMount() {
        // Get actual location
        // When the screen is focused again let's fetch new results
        this.props.navigation.addListener(
            'willFocus',
            payload => {
                this._getLocation();
            }
        );
    }

    onRegionChange(region) {
        this.setState({ region: region });
    }

    //Function to get user location using gps
    _getLocation = () => {
        let me = this;
        navigator.geolocation.getCurrentPosition(position => {
                const location = JSON.stringify(position);
                me.setState({ region: {latitude: position.coords.latitude, longitude: position.coords.longitude,
                        latitudeDelta: 0.0122,
                        longitudeDelta: 0.0021}});
            },
            error => Alert.alert('Error while getting location', error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
    }

    render() {
        return (
            <View style={styles.container}>
                <Card.Actions style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                    <View style={{flex:1, flexDirection:'column', justifyContent: 'space-around', alignItems: 'center', paddingLeft:5}}>
                        <View style={{flex:1, flexDirection:'row', justifyContent: 'space-around', alignItems: 'center'}}>
                            <View style={{flex:0.3, flexDirection:'column'}}>
                                <Image style={{width:32, height:32}} source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBDSnWBOqgvr4hOdTTAhcaNU3KAaWQNn8UHqafmbHY_y39ysZ1'}} />
                            </View>
                            <View style={{flex:0.5, flexDirection:'column'}}>
                                <Text style={{fontWeight: '900'}}>João</Text>
                                <Text style={{fontSize: 11, color:'grey'}}>Joined Dec, 2018</Text>
                            </View>
                            <View style={{flex:0.5}}>
                                <Title>{this.state.time}</Title>
                            </View>
                            <View style={{flex:1, flexDirection:'column'}}>
                                <View style={{flex: 1, padding: 5, paddingTop:10}}>
                                    <TouchableNativeFeedback onPress={() => {this.props.navigation.navigate('Map')}}>
                                        <Button mode='contained' style={{backgroundColor: 'orange'}}
                                                title='Start'>End tour</Button>
                                    </TouchableNativeFeedback>
                                </View>
                            </View>
                        </View>
                    </View>
                </Card.Actions>
                <Divider/>
                <MapViewAnimated
                    provider={PROVIDER_GOOGLE}
                    region={this.state.region}
                    style={styles.map}
                    showsUserLocation={true}>
                </MapViewAnimated>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        height:(Dimensions.get('window').height / 1.45),
        width: (Dimensions.get('window').width)
    },
});