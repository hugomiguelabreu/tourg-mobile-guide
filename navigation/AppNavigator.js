import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import MainStack from './MainStack';
import AuthStack from './AuthStack';

export default createSwitchNavigator(
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    {
        Main: MainStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'Auth'
    }

);