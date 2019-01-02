import React from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import LoadingModal from "../../components/LoadingModal";
import axios from "axios";

export default class MyBookings extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            activities: null,
            isLoading: true,
        };
    }

    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        // Set navigation param to execute function on header button
        let me = this;
        this.setState({isLoading: false});

    }

    render() {
        if(!this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ScrollView style={styles.container} contentContainerStyle={{flexGrow:1}}>
                        <View style={styles.list}>

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
