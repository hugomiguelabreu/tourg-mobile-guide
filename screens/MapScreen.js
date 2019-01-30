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
    AsyncStorage, KeyboardAvoidingView, Text, TouchableNativeFeedback, PermissionsAndroid
} from 'react-native';
import {TextInput, Button, Title, HelperText, Divider, Card, Subheading} from 'react-native-paper';
import axios from 'axios';
import {Icon, Constants} from 'expo';
import {Header} from 'react-navigation';
import MapView, {AnimatedRegion, PROVIDER_GOOGLE} from 'react-native-maps';
import {MapViewAnimated, Marker} from 'react-native-maps';
import LoadingModal from "../components/LoadingModal";

export default class MapScreen extends React.Component {

    moment = require('moment');
    geoLoc = navigator.geolocation;
    watchID= null;

    constructor(props){
        super(props);
        this.state = {
            bookingId: this.props.navigation.state.params.bookingId,
            activityId: this.props.navigation.state.params.activityId,
            activityDateId: this.props.navigation.state.params.activityDateId,
            isLoading: true,
            userPhoto: null,
            userName: '',
            userJoined: null,
            myLat: 50,
            myLng: 10,
            usrLat: null,
            usrLng: null,
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
                this._getDetails();
                this._getLocation();
            }
        );
    }

    componentWillUnmount() {
        this.geoLoc.clearWatch(this.watchID);
    }

    _getDetails = () => {
        let me = this;

        if(this.state.refreshing === true)
            this.setState({isLoading: true});

        axios.get('/guide/booking/' + this.state.bookingId)
            .then((resp) => {
                // Set response and loading
                me.setState({
                    userName: resp.data.User.name,
                    userJoined: resp.data.User.createdAt,
                    userPhoto: resp.data.User.photo_path,
                    isLoading:false
                });
            })
            .catch((err) => {
                me.setState({isLoading:false});
                console.log(err);
            });
    }

    _updateCoordinates = (lat, lng) => {
        let me = this;

        axios.post('/guide/booking/' + this.state.bookingId + '/gps',
            {lat: lat, lng: lng})
            .then((resp) => {
                // Set response and loading
                me.setState({
                    myLat: lat, myLng: lng,
                    usrLat: resp.data.user_lat, usrLng:resp.data.user_lng
                })
            })
            .catch((err) => {
                console.log(err);
            });
    }

    _stopLocation = (activityId, activityDateId) => {
        let me = this;

        axios.post('/guide/booking/end_tour',
            {activity_id:activityId, activity_date_id:activityDateId})
            .then((resp) => {
                // Set response and loading
                // Activity ended
                this.props.navigation.navigate('Home');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async requestPermissions() {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
            ]);
            if (granted.values().every((x) => x === PermissionsAndroid.RESULTS.GRANTED)) {
                return true;
            } else {
                throw false;
            }
        } catch (err) {
            console.warn(err);
        }
    }

    //Function to get user location using gps
    _getLocation = () => {
        let me = this;
        this.requestPermissions().then(() => {
            this.watchID = this.geoLoc.watchPosition(position => {
                    const location = JSON.stringify(position);
                    me.setState({ region: {latitude: position.coords.latitude, longitude: position.coords.longitude,
                            latitudeDelta: 0.0122,
                            longitudeDelta: 0.0021}});
                },
                error => {
                    Alert.alert('Error while getting location', error.message)
                },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
        }).catch(() => {
                Alert.alert('GPS is needed for tourg to work', error.message)
            });
    };

    _setMyLocation = event => {
        const myLocation = event.nativeEvent.coordinate;
        this._updateCoordinates(myLocation.latitude, myLocation.longitude);
    };

    _showUser = () => {
        if(this.state.usrLat != null && this.state.usrLng != null)
            return(
                <Marker title={this.state.userName}
                        description='Current location of client'
                        coordinate={{latitude: this.state.usrLat, longitude: this.state.usrLng}}>
                    <View style={{width: 38, height: 38}}>
                        <Image
                            source={{uri: 'http://188.166.173.44/' + this.state.userPhoto, width: 38, height: 38}}
                            style={{borderColor:'green', borderRadius: 50, borderWidth: 2}}>
                        </Image>
                    </View>
                </Marker>
            );
    };

    _onRegionChangeComplete = (region) => {
        this.setState({region: {latitude: region.latitude, longitude: region.longitude,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta}})
    };

    render() {
        if(this.state.isLoading == false){
            return (
                <View style={styles.container}>
                    <Card.Actions style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                        <View style={{flex:1, flexDirection:'column', justifyContent: 'space-around', alignItems: 'center', paddingLeft:5}}>
                            <View style={{flex:1, flexDirection:'row', justifyContent: 'space-around', alignItems: 'center'}}>
                                <View style={{flex:0.3, flexDirection:'column'}}>
                                    <Image style={{width:32, height:32}} source={{uri: 'http://188.166.173.44/' + this.state.userPhoto}} />
                                </View>
                                <View style={{flex:0.7, flexDirection:'column'}}>
                                    <Text style={{fontWeight: '900'}}>{this.state.userName}
                                    &nbsp;
                                        {this.state.usrLng == null && this.state.usrLat == null ?
                                            <Icon.Ionicons
                                                name='ios-radio-button-on'
                                                style={{color:'red', marginRight:10, paddingTop: 5}}
                                                size={14}/> :
                                            <Icon.Ionicons
                                                name='ios-radio-button-on'
                                                style={{color:'green', marginRight:10, paddingTop: 5}}
                                                size={14}/>
                                        }
                                    </Text>
                                    <Text style={{fontSize: 11, color:'grey'}}>Joined {this.moment(this.state.userJoined.replace(/[-:Z]/g, '')).format("MMM, YYYY")}</Text>
                                </View>
                                <View style={{flex:1, flexDirection:'column'}}>
                                    <View style={{flex: 1, padding: 5, paddingTop:10}}>
                                        <TouchableNativeFeedback onPress={() => {this._stopLocation(this.state.activityId, this.state.activityDateId)}}>
                                            <Button mode='contained' style={{backgroundColor: 'orange'}}
                                                    title='Start'>End meet</Button>
                                        </TouchableNativeFeedback>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Card.Actions>
                    <Divider/>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        region={this.state.region}
                        onUserLocationChange={this._setMyLocation}
                        onRegionChangeComplete={this._onRegionChangeComplete}
                        followsUserLocation={true}
                        style={styles.map}
                        showsUserLocation={true}>
                        {this._showUser()}
                    </MapView>
                </View>
            );
        }else {
            return(
                <LoadingModal />
            );
        }
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