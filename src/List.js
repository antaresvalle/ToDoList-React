import React from 'react';
// import Tasks from './Tasks';
import firebase from 'firebase';

class List extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            tasks : [
                    // {id: '1', text: 'Example Task 1', check:true},
                    // {id: '2', text: 'Example Task 2', check:false},
                    // {id: '3', text: 'Example Task 3', check:true}
                ]
        }

        // Tasks and AddForm events
        this.handleAddTask = this.handleAddTask.bind(this);

        // Firebase events
        this.handleChildAdded = this.handleChildAdded.bind(this);

        // Reference for user

        const db = firebase.database();
        this.tasksRef = db.ref().child(`tasks/${this.props.user.uid}`);
    }

    componentDidMount(){
        this.tasksRef.on('child_added', this.handleChildAdded);
    }

    handleChildAdded(data){
        const newTask = data.val();
        newTask.id = data.key;
        var newTasks = this.state.tasks.concat(newTask);
        this.setState({tasks: newTasks});
    }
   
    handleAddTask(text){
        if(!text.length){
            return;
        }
        const key = this.tasksRef.push().key;
        this.tasksRef.child(key).set({
            text: text,
            done: false,
        });
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
                    <TaskList tasks={this.state.tasks}/>
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
        this.setState({value:e.target.value});
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
            <Task key={task.id} text={task.text} check={task.check}/> 
        ))}
        </ul>);
}

function Task(props){
    return (
        <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" checked={props.check}/>
            <label className="form-check-label" for="defaultCheck1">
                <li key={props.id}>{props.text}</li>
            </label>
        </div>
    );
}



export default List;