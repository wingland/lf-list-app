import React from 'react';
import { AsyncStorage } from 'react-native';
import {
  View,
  Fab,
  Button,
  Icon,
  CheckBox,
  Container,
  Header,
  Body,
  ActionSheet,
  Right,
  Title,
  Content,
  Footer,
  Text,
  Left
} from 'native-base';
import TaskList from './TaskList';
import NewTaskEditor from './NewTaskEditor';

const tasks = [
  {
    name: 'Buy Clothes',
    order: 1,
    id: 1,
    tagged: [{
      id: 1,
      name: 'home',
      type: 'scenario'
    },{
      id: 2,
      name:'baby',
      type: 'goal'
    }],
    dueDate: 'Today'
  },{
    name: 'Watch Movies',
    complete: true,
    order: 2,
    id: 2,
    tagged: [{
      id: 3,
      name: 'outdoor',
      type: 'scenario'
    }],
    dueDate: 'Tomorrow'
  }
];

export default class ListView extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: ({tintColor}) => (<Icon name='home'/>)
  }
  constructor(props) {
    super(props);
    this.state = {
      taskCreateMode: false,
      tasks: [],
      selectMode: false
    }
  }
  async _loadInitialState() {
    const values = await AsyncStorage.getItem("tasks");
    const tasks = JSON.parse(values) ||[];
  }
  componentDidMount(){
    this._loadInitialState().done();
  }
  state = {
    taskCreateMode: false,
    tasks: tasks
  }
  addTask = () => {
    this.setState({
      taskCreateMode: true
    })

  }
  taskCreateCancelled = () => {
    this.setState({
      taskCreateMode: false
    })
  }

  onTasksChange = (tasks) => {
    this.setState({tasks}, async ()=>{
      await AsyncStorage.setItem("tasks", JSON.stringify(this.state.tasks)) 
    });
  }

  taskCreated = (task) => {
    this.setState(previousState => ({
      tasks: [task, ...previousState.tasks],
      taskCreateMode: false
    }), async ()=>{
      await AsyncStorage.setItem("tasks", JSON.stringify(this.state.tasks));
      const values = await AsyncStorage.getItem("tasks");
    });

  }

  render() {
    const { taskCreateMode } = this.state;
    return (

      <Container>
        <Header>
          <Left>
            {/* {this.state.tasks.length > 0 &&
          
          <Text 
            onPress={(e)=>{this.setState({selectMode:!this.state.selectMode})}}>
            {this.state.selectMode?'Cancel':'Select'}
          </Text>
            } */}
          </Left>
          <Body>
            <Title>My Tasks</Title>
          </Body>
          <Right>
            <Button light onPress={this.addTask}>
              <Icon name="add" />
            </Button>
          </Right>
        </Header>
        <View style={{ flex: 1}}>
          {taskCreateMode && 
          <NewTaskEditor 
            style={{flex: 0}}  
            onCreate={this.taskCreated}
            onCancel={this.taskCreateCancelled}/>
          }
          {this.state.tasks.length === 0 && <Text 
              
              onPress={this.addTask}
              style={{
              textAlign:'center',
              marginTop: '50%',
              alignSelf:'center'}}  note>No tasks, add one</Text>}
          <TaskList 
              onTaskLongPressed={this.onTaskLongPressed}
              selectMode={this.state.selectMode}
              style={{flexGrow: 1}} 
              tasks={this.state.tasks}
              onTasksChange={this.onTasksChange}/>
          {/* <Fab position="bottomRight"
            style={{ backgroundColor: '#5067FF' }}
            onPress={this.addTask}>
            <Icon name="add" />
          </Fab> */}
        </View>
        {this.state.selectMode  &&
        <Footer>
          <Left>
            <CheckBox/>
          </Left>
          {this.state.tasks.some(x=>!!x.checked) &&
          <Right >
            <Button transparent>
              <Text>Delete</Text>
            </Button>
          </Right>
          }
        </Footer>
        }

      </Container>
    );
  }
}
