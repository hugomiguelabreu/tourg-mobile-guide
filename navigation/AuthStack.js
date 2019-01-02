import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";


const AccountStack = createStackNavigator(
    {
        Login: LoginScreen,
        Register: RegisterScreen,
    },
    {
        initialRouteName: 'Login',
        navigationOptions: {
            title: null,
            headerTransparent: 'true',
        }
    }
);

export default AccountStack;
