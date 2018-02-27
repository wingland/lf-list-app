import React, {Component} from 'react';
import { View } from 'react-native';
import {Body, Text, Input, Item, Right, Left, Icon, CheckBox} from 'native-base';
import _ from 'lodash';

class Task extends Component {
  state = {
    taggedLine: '',
    selected: false,
    taskChange: null,
    nameEditMode: false,
    markersEditMode: false
  }


  componentDidMount() {
    this.setState({
      taskChange: {...this.props.task},
      taggedLine: this.getTagLine(this.props.task)
    });
  }
  onNameChanged(name) {
    this.setState((prevState)=>({
      taskChange: {...prevState.taskChange, name}
    }));
  }

  toggleSelect = (e) => {
    this.setState((prevState)=>({
      selected: !prevState.selected,
      taskChange: {...prevState.taskChange, checked: !prevState.selected}
    }),()=>{
      this.props.onUpdate(this.state.taskChange);
    });
  }

  onTagsChanged(taggedLine) {
    this.setState({taggedLine});
  }
  onTagInputFocused = ()=>{
    if (!this.state.taggedLine.trim()) {
      this.setState({taggedLine: '@'})
    }
  }
  onTagsUpdate() {
    this.setState({markersEditMode: false});
    let matchedTags = _.uniq(this.state.taggedLine.match(/@[^@#\^ ]+/g)) || [];
    const tagged = matchedTags.map(t=>({
      name: t.substr(1)
    }));
    this.setState((prevState)=>({
      taskChange: {...prevState.taskChange, tagged}
    }),()=>{
      this.props.onUpdate(this.state.taskChange);
    });
  }

  getTagLine(task) {
    
    return _.map(task.tagged, t=> `@${t.name}`).join(' ');
  }
  render() {
    const { task } = this.props;
    const { taskChange, selected, taggedLine, editMode, markersEditMode } = this.state;
    return (
      <React.Fragment>
        {this.props.selectMode &&
        
        <CheckBox onPress={this.toggleSelect} checked={selected} style={{marginLeft: 5}}/>
        }
        { task.nextAction && 
          <Icon style={{marginLeft: 5, marginRight: 5, color: '#e34c26'}} name="ios-flag" color="red"/>
        }
        
        <Body>
          {editMode ? 
          
          <Input placeholder="Input Task Name" 
            autoFocus={true}
                name="name"
                value={taskChange.name} 
                onChangeText={name=> this.onNameChanged(name)}
                onEndEditing = {e=> { this.setState({editMode: false});this.props.onUpdate(taskChange)}}
                />
          :
          <View>
            
            <Text 
          onPress={e=>{ (!task.complete) && this.setState({editMode: true})}}
          style={{
            textDecorationLine: task.complete?'line-through': 'none',
            color:task.complete?'grey':'black'}}>{task.name}</Text>
          </View>
          }
          {markersEditMode ? 
          <Input placeholder="Add tags here" 
            autoFocus={true}
              name="tags"
              onFocus={this.onTagInputFocused}
              value={taggedLine} 
              onChangeText={tagText=> this.onTagsChanged(tagText)}
              onEndEditing = { e=> this.onTagsUpdate()}
              />
          :
          <Text style={{paddingTop: 20}}
          onPress={e=>{
            if (task.complete) return;
            this.setState({taggedLine: this.getTagLine(task),markersEditMode: true})
          }}
          note>{this.getTagLine(task) || 'Add tags here'}</Text>
          }
        </Body>
        <Right>
          {!!task.dueDate && <Text note> {`${task.dueDate}`}</Text>}
        </Right>
      </React.Fragment>
    );
  }
}

export default Task;