import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  RefreshControl, FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import {Subheading, Title} from 'react-native-paper';
import {Icon, WebBrowser} from 'expo';
import LoadingModal from '../components/LoadingModal';
import BookedCard from '../components/BookedCard';
import axios from 'axios';
import guideStore from "../stores/GuideStore";
import {Constants} from 'expo';

export default class HomeScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activities: null,
            bookings: [],
            isLoading: true,
            refreshing: false,
        };
    }

    static navigationOptions = {
        headerTitle: <View style={{flex:1, alignItems:'center', justifyContent:'center'}}><Title>UPCOMING TOURS</Title></View>,
        headerStyle: {
          marginTop: -Constants.statusBarHeight,
        },
    };

    componentDidMount() {
        // When the screen is focused again let's fetch new results
        this.props.navigation.addListener(
            'willFocus',
            payload => {
                this._getBookings();
            }
        );
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this._getBookings().then(() => {
            this.setState({refreshing: false});
        });
    }

    async _getBookings() {
        let me = this;

        if(this.state.refreshing === true)
            this.setState({isLoading: true});

        await axios.get('/guide/bookings')
            .then((resp) => {
                // Set response and loading
                console.log(resp.data);
                me.setState({isLoading:false, activities: resp.data.Activities});
                // Clear bookings
                this.setState({bookings: []});
                // Map new bookings to list
                this.state.activities.forEach((activity) => {
                    activity.Bookings.forEach((book) => {
                        this.setState({bookings: [...this.state.bookings, book]});
                    });
                });
            })
            .catch((err) => {
                me.setState({isLoading:false, activities: null});
                console.log(err);
            });
    }

    activities = () => {
        if(this.state.bookings == null || this.state.bookings.length == 0){
            return(<View style={{flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Title style={{color:'gray'}}>No upcoming tours</Title>
            </View>);
        }else{
            return(<FlatList
                data={this.state.bookings}
                keyExtractor={(item, index) => 'item' + index}
                renderItem={({item}) =>
                    <BookedCard id={item.id} title={item.Activity.title} description={item.Activity.description}
                                userId={item.User.id} accepted={item.accepted}
                                userJoined={item.User.createdAt}
                                activityId={item.Activity.id}
                                userName={item.User.name} navigation={this.props.navigation}
                                bookingDate={item.Activity_Date.timestamp}/>
                }
            />);
        }
    }

    render() {
        if(!this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ScrollView style={styles.container} contentContainerStyle={{flexGrow:1}}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh} />
                                }>
                        <View style={{flexDirection: 'column', alignItems:'center', justifyContent:'space-between', paddingBottom: 10}}>
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Icon.Ionicons
                                    name='md-arrow-round-down'
                                    style={{color:'gray', marginRight:10, paddingTop: 5}}
                                    size={16}
                                />
                                <Subheading style={{color:'gray'}}>Pull down to refresh</Subheading>
                                <Icon.Ionicons
                                    name='md-arrow-round-down'
                                    style={{color:'gray', marginLeft:10, paddingTop: 5}}
                                    size={16}
                                />
                            </View>
                        </View>
                        <View style={styles.list}>
                            {this.activities()}
                        </View>
                    </ScrollView>
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
        flex: 1,
        paddingTop: 5,
        backgroundColor:'#F1F0F4',
    },

    list: {
        paddingLeft: 15,
        paddingRight: 15,
        flex:1,
        flexDirection: 'column',
    },
});
