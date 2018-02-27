import React from 'react';
import { View, Text } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import ListView from './ListView';

export default DrawerNavigator(
  {
    Home: {
      screen: ListView
    },
  },
  {
    initialRouteName: 'Home',
  }
);