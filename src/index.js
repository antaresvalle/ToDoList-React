import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import firebase from 'firebase';



  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDfK8alXxVvyP8OUmrsCRlQzbuTFoXGSpc",
    authDomain: "todolist-3ce6a.firebaseapp.com",
    databaseURL: "https://todolist-3ce6a.firebaseio.com",
    projectId: "todolist-3ce6a",
    storageBucket: "todolist-3ce6a.appspot.com",
    messagingSenderId: "1002643282496"
  };
  firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));

