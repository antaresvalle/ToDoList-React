import React from 'react';
import firebase from 'firebase';

class Authenticate extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            email: '',
            password: '',
            error: ''
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleCreateUser = this.handleCreateUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleEmailChange(e){
        this.setState({email: e.target.value});
    }

    handlePasswordChange(e){
        this.setState({password: e.target.value});
    }

    handleCreateUser(){
        firebase.auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .catch(error =>{
            console.log(error);
            this.setState({error: error.message});
        });
    }

    handleLogin(){
        firebase.auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .catch(error =>{
            console.log(error);
            this.setState({error: error.message});
        });
    }

    render(){
        return(
            <form>
                <div>{this.state.error}</div>
                <h1>Task List</h1>
                <div className="form-group">
                    <label for="inputEmail1">Email address</label>
                    <input type="email" className="form-control" id="inputEmail1" aria-describedby="emailHelp" placeholder="Enter email" value={this.state.email} onChange={this.handleEmailChange}/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                 </div>
                    <div className="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
                </div>
                <button type='button' className="btn btn-primary" onClick={this.handleLogin}>SignIn</button>
                <button type="button" className="btn btn-primary" onClick={this.handleCreateUser}>New User</button>
                
            </form>
        );
    }
}

export default Authenticate;