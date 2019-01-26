import React from 'react';
import {View, Text, TouchableNativeFeedback, Image, Alert, StyleSheet, ActivityIndicator, Modal} from 'react-native';
import {Title, Card, Paragraph, Button, Divider, Subheading} from "react-native-paper";
import Colors from "../constants/Colors";
import {Icon} from "expo";
import axios from "axios";

export default class BookedCard extends React.Component {

    moment = require('moment');

    constructor(props){
        super(props);
        this.state = {
            bookingId: this.props.id,
            accepted: this.props.accepted,
            finished: this.props.finished,
            end: this.moment(this.props.bookingDate.replace(/[-:Z]/g, '')).subtract(2, 'h'),
            time: this.moment.duration(this.moment(this.props.bookingDate.replace(/[-:Z]/g, '')).subtract(2, 'h').diff(this.moment(Date.now()))),
        }
    }

    componentDidMount() {

        if(this.state.accepted == null &&
            (this.moment(Date.now()).isBefore(this.state.end))) {
            this.timer = setInterval(() => {
                this.setState({ time: this.moment.duration(this.state.end.diff(this.moment(Date.now()))) });
                if((this.state.time.valueOf() <= 0))
                    clearInterval(this.timer);
            }, 1000);
        }

    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    _confirmed() {
        return(
            <View style={{flex:1, flexDirection:'row', justifyContent:'flex-start', alignItems: 'center'}}>
                <Icon.Ionicons
                    name='md-checkmark-circle-outline'
                    size={16}
                    color='green'
                    style={{ marginRight: 0 }}
                />
                <Subheading style={{fontSize:14, color:'green', marginLeft: 5}}>Confirmed</Subheading>
            </View>
        );
    }

    _done() {
        return(
            <View style={{flex:0.9, flexDirection:'row', justifyContent:'flex-start', alignItems: 'center'}}>
                <Icon.Ionicons
                    name='md-happy'
                    size={16}
                    color='green'
                    style={{ marginRight: 0 }}
                />
                <Subheading style={{fontSize:14, color:'green', marginLeft: 5}}>Done</Subheading>
            </View>
        );
    }

    _timeOut() {
        return(
            <View style={{flex:1, flexDirection:'row', justifyContent:'flex-start', alignItems: 'center'}}>
                <Icon.Ionicons
                    name='md-time'
                    size={16}
                    color='gray'
                    style={{ marginRight: 0 }}
                />
                <Subheading style={{fontSize:14, color:'gray', marginLeft: 5}}>Timed-out</Subheading>
            </View>
        );
    }

    _pending() {
        return(
            <View style={{flex:1, flexDirection:'row', justifyContent:'flex-start', alignItems: 'center'}}>
                <Icon.Ionicons
                    name='md-time'
                    size={16}
                    color='orange'
                    style={{ marginRight: 0 }}
                />
                <View syle={{flex:1, flexDirection:'column'}}>
                    <Subheading style={{fontSize:14, color:'orange', marginLeft: 5}}>Pending</Subheading>
                    <Subheading style={{fontSize:14, color:'orange', marginLeft: 5}}>({this.moment(this.state.time.asMilliseconds()).format('HH:mm:ss')})</Subheading>
                </View>
            </View>
        );
    }

    _canceled() {
        return(
            <View style={{flex:1, flexDirection:'row', justifyContent:'flex-start', alignItems: 'center'}}>
                <Icon.Ionicons
                    name='md-close-circle-outline'
                    size={16}
                    color='red'
                    style={{ marginRight: 0 }}
                />
                <Subheading style={{fontSize:14, color:'red', marginLeft: 5}}>Canceled</Subheading>
            </View>
        );
    }

    _actions() {

        if(this.state.accepted == null &&
            (this.state.time.valueOf() <= 0)){
            return(
                <View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'space-between', padding: 10}}>
                    <Title style={{color:'gray'}}>Timed-out</Title>
                </View>
            );
        }

        if(this.state.accepted == true
            && this.state.finished == false
            && (this.moment(Date.now()).isBefore(this.moment(this.state.end).add(this.props.duration+60, 'm')))){
            return (
                <Card.Actions>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center'
                        }}>
                            <View style={{flex: 1, padding: 5}}>
                                <TouchableNativeFeedback onPress={() => {this.props.navigation.navigate('Map', {bookingId:this.props.id,
                                    activityId: this.props.activityId, activityDateId: this.props.activityDateId})}}>
                                    <Button mode='contained' style={{backgroundColor: 'orange'}}
                                            title='Start'>Start meet</Button>
                                </TouchableNativeFeedback>
                            </View>
                            <View style={{flex: 1, padding: 5}}>
                                <TouchableNativeFeedback onPress={() => {
                                    this.cancelTour()
                                }}>
                                    <Button mode='contained' style={{backgroundColor: 'red'}}
                                            title='Cancel'>
                                        Cancel
                                    </Button>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                    </View>
                </Card.Actions>
            );
        }

        if(this.state.accepted == null) {
            return (
                <Card.Actions>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center'
                        }}>
                            <View style={{flex: 1, padding: 5}}>
                                <TouchableNativeFeedback onPress={() => {
                                    this.updateActivityState(true)
                                }}>
                                    <Button mode='contained' style={{backgroundColor: 'green'}}
                                            title='Accept'>Accept</Button>
                                </TouchableNativeFeedback>
                            </View>
                            <View style={{flex: 1, padding: 5}}>
                                <TouchableNativeFeedback onPress={() => {
                                    this.cancelTour()
                                }}>
                                    <Button mode='contained' style={{backgroundColor: 'red'}}
                                            title='Cancel'>Cancel</Button>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                    </View>
                </Card.Actions>
            );
        }

    }

    _state(){
        if(this.state.accepted == null
            && (this.state.time.valueOf() <= 0)){
            return(
                this._timeOut()
            );
        }

        if(this.state.finished == true)
            return this._done();
        else if(this.state.finished == false && !(this.moment(Date.now()).isBefore(this.moment(this.state.end).add(this.props.duration+60, 'm'))))
            return this._timeOut();
        else if(this.state.accepted == true)
            return this._confirmed()
        else if(this.state.accepted == false)
            return this._canceled();
        else
            return this._pending();
    }

    cancelTour(){
        Alert.alert(
            'Cancel tour',
            'Do you want to cancel the tour?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () => this.updateActivityState(false)},
            ], { cancelable: false });
    }

    updateActivityState(state){
        let me = this;

        axios.post('/guide/booking/' + this.state.bookingId + '/accept',
            {state: state})
            .then((resp) => {
                // Set response and loading
                me.setState({accepted:state});
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <View style={{flex:1, flexDirection: 'column', paddingBottom: 30}}>
                    <TouchableNativeFeedback
                        onPress={() => {
                            this.props.navigation.navigate('Activity', {activityId: this.props.activityId})
                        }}>
                    <Card style={{flex:1}}>
                        <Card.Cover style={{height:120}} source={{ uri: 'https://picsum.photos/500/?random' }} />
                        <Card.Content style={{flex:1, paddingTop: 5}}>
                            <View style={{flex:1, flexDirection:'row'}}>
                                <View style={{flex:3, flexDirection:'column'}}>
                                    <Title>{this.props.title}</Title>
                                    <Paragraph numberOfLines={2}>{this.props.description}</Paragraph>
                                </View>
                                {this._state()}
                            </View>
                        </Card.Content>
                        <Divider style={{marginTop: 10, marginBottom: 2}} />
                        <Card.Actions>
                            <View style={{flex:1, flexDirection:'column', justifyContent: 'space-around', alignItems: 'center', paddingLeft:5}}>
                                <View style={{flex:1, flexDirection:'row', justifyContent: 'space-around', alignItems: 'center'}}>
                                    <View style={{flex:0.5, flexDirection:'row'}}>
                                        <Image style={{width:32, height:32}} source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBDSnWBOqgvr4hOdTTAhcaNU3KAaWQNn8UHqafmbHY_y39ysZ1'}} />
                                    </View>
                                    <View style={{flex:1, flexDirection:'column'}}>
                                        <Text style={{fontWeight: '900'}}>{this.props.userName}</Text>
                                        <Text style={{fontSize: 11, color:'grey'}}>Joined {this.props.userJoined != null ? this.moment(this.props.userJoined.replace(/[-:Z]/g, '')).format("MMM, YYYY") : ''}</Text>
                                    </View>
                                    <View style={{flex:1, flexDirection:'column', paddingLeft: 10}}>
                                        <Text style={{fontWeight: '900'}}>Date</Text>
                                        <View style={{flex:1, flexDirection:'row', justifyContent:'flex-start'}}>
                                            <Icon.Ionicons
                                                name='md-calendar'
                                                size={12}
                                                style={{ marginRight: 5 }}
                                            />
                                            <Text style={{ fontSize: 11, color:'grey' }}>{this.moment(this.props.bookingDate.replace(/[-:Z]/g, '')).format("DD/MM/YYYY")}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:1, flexDirection:'column'}}>
                                        <Text style={{fontWeight: '900'}}>Hour</Text>
                                        <View style={{flex:1, flexDirection:'row', justifyContent:'flex-start'}}>
                                            <Icon.Ionicons
                                                name='md-time'
                                                size={12}
                                                style={{ marginRight: 5 }}
                                            />
                                            <Text style={{fontSize: 11, color:'grey'}}>{this.moment(this.props.bookingDate.replace(/[-:Z]/g, '')).format("HH:mm ")}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Card.Actions>
                        {this._actions()}
                    </Card>
                    </TouchableNativeFeedback>
            </View>
        );
    }
}