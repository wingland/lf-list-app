import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Container, Input, Button, Icon, Item, Left } from 'native-base';
import { Row, Grid, Col } from 'react-native-easy-grid';
import _ from 'lodash';

class NewTaskEditor extends Component {
  state = {
    fullText: ''
  }

  componentDidMount(){
    if (this.props.editMode) {
      this.setState({
        fullText: this.getFullText(this.props.task)
      });
    }
  }
  getFullText(task) {
    const tags = _.map(task.tagged, t=> `@${t.name}`).join(' ');
    const dueDate = task.dueDate ? '^'+task.dueDate : '';
    let fullText = task.name;
    if (tags) fullText+= ' ' + tags;
    if(dueDate) fullText+=' ' + dueDate;
    return fullText;

  }

  onUpdate = () => {
    const fullText = this.state.fullText;
    let matchedTags = fullText.match(/@[^@#\^ ]+/g);
    let matchedDue = fullText.match(/\^[^@#\^ ]+/g);
    matchedTags = _.uniq(matchedTags) || [];
    matchedDue = matchedDue ? matchedDue[0].substr(1) : undefined;
    const name = fullText.replace(/@[^@#\^ ]+/g, '').replace(/\^[^@#\^ ]+/g, '').trim();
    const tagged = matchedTags.map(t=>({
      id: Date.now(),
      name: t.substr(1)
    }));
    if (this.props.editMode) {
      this.props.onUpdate({
        name: name,
        tagged: tagged,
        dueDate: matchedDue
      })
    } else {
      this.props.onCreate({
        id: Date.now(),
        order: Date.now(),
        name: name,
        tagged: tagged,
        dueDate: matchedDue
      });
    }
  }

  render() {
    const { style } = this.props;
    return (
      <View style={style}>
        <Item>
          <Input placeholder="Input Task Name" 

                autoFocus={true}
                name="name"
                value={this.state.fullText} 
                onSubmitEditing = {this.onUpdate}
                onChangeText={(fullText) => this.setState({fullText})}/>
          <Button onPress={this.onUpdate} transparent primary>
            <Icon name='checkmark' />
          </Button>
          <Button onPress={this.props.onCancel} transparent dark>
            <Icon name='close' />
          </Button>
        </Item>
      </View>
    );
  }
}

export default NewTaskEditor;