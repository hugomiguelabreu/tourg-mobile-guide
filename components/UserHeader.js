import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Title, Searchbar, Button, TouchableRipple} from "react-native-paper";
import Colors from "../constants/Colors";
import {Icon} from "expo";
import guideStore from '../stores/GuideStore';
import {observer} from "mobx-react/native";

@observer export default class SearchHeader extends React.Component {

    moment = require('moment');

    render() {
        return (
            <View style={{flex:1, flexDirection:'row', alignItems: 'center', justifyContent:'space-around'}}>
                <View style={{flex:0.3, flexDirection:'column', justifyContent: 'center', alignItems:'center'}}>
                    <Image style={{width:54, height:54}}
                           source={{uri: guideStore.photo_path}}/>
                </View>
                <View style={{flex:0.4, flexDirection:'column', justifyContent: 'flex-start', alignItems:'flex-start'}}>
                    <Text style={{fontWeight: '900'}}>{guideStore.name}</Text>
                    <Text style={{fontSize: 11, color:'grey'}}>Joined {guideStore.createdAt != null ?
                        this.moment(guideStore.createdAt.replace(/[-:Z]/g, '')).format("MMM, YYYY") : ''}</Text>
                </View>
                <View style={{flex:0.4, flexDirection:'row', justifyContent:'flex-start'}}>
                    <Icon.Ionicons
                        name='md-star'
                        size={16}
                        style={{ marginTop:0.5, marginRight: 5 }}
                    />
                    <Text style={{ fontSize: 14, color:'grey', marginRight: 5 }}>
                        {guideStore.rating == null ? 0 : (guideStore.rating / guideStore.rating_count).toFixed(1)}
                    </Text>
                    <Text style={{ fontSize: 14, color:'grey' }}>({guideStore.rating_count})</Text>
                </View>
                <View style={{flex:0.2, flexDirection:'row', justifyContent:'flex-start'}}>
                    <TouchableRipple
                        onPress={() => {guideStore.logout();this.props.navigation.navigate('Auth');}}>
                        <Button mode='text'>
                            <Icon.Ionicons
                                name='ios-log-out'
                                size={28}
                                style={{ margin:2 }}
                            />
                        </Button>
                    </TouchableRipple>
                </View>
            </View>
        );
    }
}