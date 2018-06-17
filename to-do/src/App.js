import React, { Component } from 'react';
import './App.css';
import Notes from './Notes.js';
import Form from './Form.js';
import { config_db } from './config';
import firebase from 'firebase/app';
import 'firebase/database';

class App extends Component {

  constructor(props){
    super(props);
    //we initialize the database
    this.app = firebase.initializeApp(config_db);
    //the database has the same elements as in the notesArray

    //reference https://firebase.google.com/docs/database/web/read-and-write

    this.database = this.app.database().ref().child('notesArr');

    //start up with empty array on launch of app
    this.state = {notesArr: [],}

    //binding the methods
    this.createNote = this.createNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
  }

  //using componentDidMount since WillMount is deprecated

  componentDidMount(){
    //at first, we have the previousNotes being set to what we currently have
    const previousNotes = this.state.notesArr;
    //from firebase docs: Writing is done with the set() method
    //and reading can be done with the on()

    /*anytime we read data from database we receive that data
      in the form of a data snapshot object, which we pass here
      we inspect the data by using the val method*/
    this.database.on('child_added', snap => {
      previousNotes.push({
        //the following are key,value pairs
        id: snap.key, //a unique id provided by firebase
        notesContent: snap.val().notesContent,
      })

      //now update the setState
      this.setState({
          notesArr: previousNotes
      })
    })

    //for removing items
    this.database.on('child_removed', snap => {
      //we will identify the item we want to delete by usng the note id
      for (var i = 0; i < previousNotes.length; i++) {
        //deleting it happens with the splice() method
        if(previousNotes[i].id === snap.key)
        {
          //stands for splice(startIndex, numbOfThingsToDelete)
          previousNotes.splice(i,1);
        }
        //update state when removed
        this.setState({
            notesArr: previousNotes
        })
      }
    })
  }

  //method for adding notesArr, we pass it a note object
  createNote(note){
    this.database.push().set({ notesContent: note});
    /*used this as reference
    var joined = this.state.myArray.concat('new value');
    this.setState({ myArray: joined })
    */
  }
  //we pass it the notesId, not the contents, since the db will look at the
  //id when removing it, not at its value
  removeNote(notesId){
    this.database.child(notesId).remove();
  }

  render() {
    return (
      <div className="wrapper">
          <h1>To do list </h1>
          <div className="formStyle">
            <Form createNote={this.createNote}/>
          </div>
        <div className="notesBody">
          {
            /*we map each of the noteElements (notesArr) to our note array
            where each note has a content, id and key */
            this.state.notesArr.map((noteElement) => {
              return (
                <Notes notesContent={noteElement.notesContent}
                 notesId={noteElement.id} key={noteElement.id}
                 removeNote={this.removeNote}/>
              )
            })
          }
        </div>
      </div>
    );
  }
}

export default App;
