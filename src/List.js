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
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);

        // Firebase events
        this.handleChildAdded = this.handleChildAdded.bind(this);
        this.handleChildChanged = this.handleChildChanged.bind(this);
        this.handleChildRemoved = this.handleChildRemoved.bind(this);

        // Reference for user
        const db = firebase.database();
        this.tasksRef = db.ref().child(`tasks/${this.props.user.uid}`);
    }

    componentDidMount(){
        this.tasksRef.on('child_added', this.handleChildAdded);
        this.tasksRef.on('child_changed', this.handleChildChanged);
        this.tasksRef.on('child_removed', this.handleChildRemoved);
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
        this.tasksRef.child(key).set({
            text: text,
            done: false,
        });
    }  

    handleCheck(e){
        const parent = e.target.closest('.task');
        const tasksRef = this.tasksRef.child(parent.id);
        tasksRef.update({done: e.target.checked});
    }

    handleDelete(e){
        const parent = e.target.closest('.task');
        const taskRef = this.tasksRef.child(parent.id);
        taskRef.remove();
    }

    handleChildRemoved(data){
        const newTasks = this.state.tasks.concat([]);
        const inddex = newTasks.findIndex(task => task.id === data.key);

        newTasks.splice(inddex,1);

        this.setState({ tasks: newTasks});
    }

    handleEdit(text, id){
        const taskRef = this.tasksRef.child(id);
        taskRef.update({
            text: text
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
                    <TaskList tasks={this.state.tasks} onCheck={this.handleCheck} onDelete={this.handleDelete} onEdit={this.handleEdit}/>
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
            <Task key={task.id} text={task.text} id={task.id} done={task.done} onCheck={props.onCheck} onDelete={props.onDelete} onEdit={props.onEdit}/> 
        ))}
        </ul>);
}

class Task extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            editing: false,
            text: '',
        }
        this.handleEdit = this.handleEdit.bind(this);
        this.makeEditable = this.makeEditable.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.inputRef = React.createRef();
    }

    handleEdit(){
        this.props.onEdit(this.state.text, this.props.id);
        this.setState({editing:false});
    }

    makeEditable(){
        this.setState({editing: true, text: this.props.text});
    }

    handleInputChange(e){
        this.setState({ text: e.target.value});
    }

    handleKeyUp(e){
        if(e.keyCode===13){
            this.handleEdit(e);
        }
    }

    handleCancel(){
        this.setState({editing: false});
    }
    
    render(){
        if(this.state.editing){
            return (
                <div className="form-check task" id={this.props.id}>
                    <input type="text" ref={this.inputRef} id={`input-${this.props.id}`} value={this.state.text} onChange={this.handleInputChange} onKeyUp={this.handleKeyUp}/>
                    <button onClick={this.handleCancel}>cancel</button>
                    <button onClick={this.handleEdit}>save</button>
                </div>
            );
        } else {
            return (
                <div className="form-check task" id={this.props.id}>
                    <input className="form-check-input" type="checkbox" checked={this.props.done} onChange={this.props.onCheck}/>
                    <label className="form-check-label" htmlFor="defaultCheck1">
                        <li key={this.props.id}>{this.props.text}</li>
                    </label>
                    <button onClick={this.makeEditable}>edit</button>
                    <button onClick={this.props.onDelete}>delete</button>
                </div>
            );
        } 
    }
}

export default List;