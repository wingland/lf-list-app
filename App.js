import React from 'react';
import { Root } from "native-base";
import RootNavigator from './RootNavigator';
export default class App extends React.Component {

  render() {
    return (
      <Root>
      <RootNavigator/>
      </Root>
    );
  }
}
