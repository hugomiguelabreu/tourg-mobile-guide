import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text, FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import {Title} from 'react-native-paper';
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
        };
    }

    static navigationOptions = {
        headerTitle: <View style={{flex:1, alignItems:'center', justifyContent:'center'}}><Title>UPCOMING TOURS</Title></View>,
        headerStyle: {
          marginTop: -Constants.statusBarHeight,
        }
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

    _getBookings() {
        let me = this;
        this.setState({isLoading: true});
        axios.get('/guide/bookings')
            .then((resp) => {
                console.log(resp.data[0].Activities);
                me.setState({isLoading:false, activities: resp.data[0].Activities});
                this.state.activities.forEach((activity) => {
                    activity.Bookings.forEach((book) => {
                        this.setState({bookings: [...this.state.bookings, book]});
                    });
                });
                console.log(this.state.bookings);
            })
            .catch((err) => {
                me.setState({isLoading:false, activities: null});
                console.log(err);
            });
    }

    activities = () => {
        if(this.state.bookings == null || this.state.bookings.length == 0){
            return(<View style={{flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Title style={{color:'gray'}}>No booked activities</Title>
            </View>);
        }else{
            return(<FlatList
                data={this.state.bookings}
                keyExtractor={(item, index) => 'item' + index}
                renderItem={({item}) =>
                    <BookedCard id={item.id} title={item.Activity.title} description={item.Activity.description}
                                guideId={guideStore.id}
                                guideName={guideStore.name} guideJoined={guideStore.createdAt} navigation={this.props.navigation}
                                bookingDate={item.createdAt}
                                rating = {true} />
                }
            />);
        }
    }

    render() {
        if(!this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ScrollView style={styles.container} contentContainerStyle={{flexGrow:1}}>
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
