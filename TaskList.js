import React, { Component } from 'react'
import { ListView } from 'react-native'
import { List, Button, Icon, ListItem, ActionSheet, Text } from 'native-base';
import { Row, Grid, Col } from 'react-native-easy-grid';
import Task from './Task';
import NewTaskEditor from './NewTaskEditor';
import _ from 'lodash';

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      selectMode: false,
      taskRowInEdit: undefined
    }
  }
  onToggleComplete = (task, secId, rowId, rowMap) => {
    rowMap[`${secId}${rowId}`].props.closeRow();
    const newData = [...this.props.tasks];
    newData[rowId].complete = !task.complete;
    this.props.onTasksChange(newData);
  }

  onDelete = (task, secId, rowId, rowMap) => {
    //TODO: delete
    rowMap[`${secId}${rowId}`].props.closeRow();
    const newData = [...this.props.tasks];
    newData.splice(rowId, 1);
    this.props.onTasksChange(newData);
  }

  onEdit = (task, secId, rowId, rowMap) => {

    rowMap[`${secId}${rowId}`].props.closeRow();
    this.setState({
      taskRowInEdit: rowId
    });
    //TODO: edit
  }


  taskUpdateCancelled = () => {
    this.setState({
      taskRowInEdit: null
    });
  }
  onTaskUpdate = (taskChange, rowId) => {
    const newData = [...this.props.tasks];
    const matchedTask = newData[rowId];
    newData[rowId] = {...matchedTask, ...taskChange};
    this.props.onTasksChange(newData);
    this.setState({
      taskRowInEdit: null
    });
  }
  refreshTask = () => {
    this.props.onTasksChange(this.props.tasks);
  }

  onTaskLongPressed = (task, rowId) => {
    const firstOption = task.nextAction ? "Hold on":"Next Action";

    ActionSheet.show(
      {
        options: [firstOption, "Schedule", "Delay", "Blocked by", "Cancel"],
        cancelButtonIndex: 4,
        title: "Organize this task",
      },
      buttonIndex => {
        switch(buttonIndex) {
          case 0: task.nextAction = !task.nextAction; this.refreshTask(); break;
        }
      }
    )
  }

  render() {
    const { taskRowInEdit }= this.state;
    const { selectMode } = this.props;
    return (
      <List
         dataSource={this.ds.cloneWithRows(this.props.tasks)}
         renderRow={(task, secId, rowId) =>
          <ListItem 
            onLongPress={(e)=>this.onTaskLongPressed(task, rowId)}
            key={task.id}>
            {/* { taskRowInEdit === rowId ? 
            <NewTaskEditor style={{flex:1}} task={task} editMode={true}
                onUpdate={(taskChange)=>this.onTaskUpdate(taskChange, rowId)}
                onCancel={this.taskUpdateCancelled}
            />:  */}
            <Task task={task} 
                      onChecked={(checked)=>{task.checked=checked}}
                      selectMode={selectMode}
                      onUpdate={(taskChange)=>this.onTaskUpdate(taskChange, rowId)}
            />
            
          </ListItem>}
        renderLeftHiddenRow={(task, secId, rowId, rowMap) =>
          <Button full onPress={()=>this.onToggleComplete(task, secId, rowId, rowMap)}>
            <Icon active name={task.complete ? 'undo':'checkmark'} />
          </Button>}

        renderRightHiddenRow={(task, secId, rowId, rowMap)  =>
          <Grid>
          <Col>
          <Button full onPress={() =>this.onEdit(task, secId, rowId, rowMap)}>
            <Icon active name="md-create" />
          </Button>
          </Col>
          <Col>
          <Button full danger onPress={()=>this.onDelete(task, secId, rowId, rowMap)}>
            <Icon active name="trash" />
          </Button>
          </Col>
          </Grid>
        }
        leftOpenValue={75}
        rightOpenValue={-150}
      >
      </List>
    );
  }
}

export default TaskList;