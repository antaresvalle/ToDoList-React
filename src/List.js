import React from 'react';
// import Tasks from './Tasks';
import firebase from 'firebase';

class List extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            tasks : []
        }

        // Tasks and AddForm events
        this.handleAddTask = this.handleAddTask.bind(this);
        this.handleCheck = this.handleCheck.bind(this);

        // Firebase events
        this.handleChildAdded = this.handleChildAdded.bind(this);
        this.handleChildChanged = this.handleChildChanged.bind(this);

        // Reference for user
        const db = firebase.database();
        this.tasksRef = db.ref().child(`tasks/${this.props.user.uid}`);
    }

    componentDidMount(){
        this.tasksRef.on('child_added', this.handleChildAdded);
        this.tasksRef.on('child_changed', this.handleChildChanged);
    }

    handleChildAdded(data){
        const newTask = data.val();
        newTask.id = data.key;
        var newTasks = this.state.tasks.concat(newTask);
        this.setState({tasks: newTasks});
    }
   
    handleChildChanged(data){
        // aqui debemos actualizar el estado con el nodo que cambio desde firebase, reemplazando valor del check 
        console.log(data.val());
        const taskVal = data.val();
        taskVal.id = data.key;
        console.log(taskVal.id);

        const newtTasksList = this.state.tasks.concat([]); 
        const taskIndex = newtTasksList.findIndex(task=>task.id === data.key);

        // insert the new task in place 
        newtTasksList.splice(taskIndex, 1, taskVal);
        // rewrite the aray
        this.setState({tasks: newtTasksList});
    }

    handleAddTask(text){
        if(!text.length){
            return;
        }
        const key = this.tasksRef.push().key;
        this.taskRef.child(key).set({
            text: text,
            done: false,
        });
    }  

    handleCheck(e){
        const parent = e.target.closest('.task');
        const tasksRef = this.tasksRef.child(parent.id);
        tasksRef.update({done: e.target.checked});
    }
    // 
    render(){
        return (
            <section>
                <div>
                    <div className="row">
                        <div className="col">
                            <h2>TaskList</h2>
                        </div>
                        <div className="col">
                            <button type="button" className="btn btn-primary right" onClick={()=>firebase.auth().signOut()}>Logout</button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="row">
                        <div className="col">
                            <p>Welcome back: <strong>{this.props.user.email}</strong></p>
                        </div>
                    </div>
                </div>
                
                
                <section>
                    <AddForm onAdd={this.handleAddTask} />
                    <h4>Tasks</h4>
                    <TaskList tasks={this.state.tasks} onCheck={this.handleCheck}/>
                </section>
             </section>
            )
    }
    
}

class AddForm extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            value: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    handleChange(e){
        // this.setState({value:e.target.value});
    }
    handleClick(){
        this.props.onAdd(this.state.value); //
        this.setState({value:""});
    }
    handleKeyUp(e){
        if(e.keyCode===13){
            this.handleClick();
        }
    }

    render(){
        return(
            <div className='addForm'>
                <input type='text' className="input-task" placeholder="New Task" onKeyUp={this.handleKeyUp} onChange={this.handleChange} value={this.state.value} />
                <button type='button' onClick={this.handleClick}>Add</button>
            </div>
        );
        
    }
}

function TaskList(props) {
    return (
        <ul>
        {props.tasks.map(task => (
            <Task key={task.id} text={task.text} id={task.id} done={task.done} onCheck={props.onCheck} /> 
        ))}
        </ul>);
}

class Task extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            text: '',
        }
    }

    render(){
        return (
            <div className="form-check task" id={this.props.id}>
                <input className="form-check-input" type="checkbox" checked={this.props.done} onChange={this.props.onCheck}/>
                <label className="form-check-label" for="defaultCheck1">
                    <li key={this.props.id}>{this.props.text}</li>
                </label>
                <button>delete</button>
            </div>
        );
    }
}

export default List;