import React, { Component } from 'react';
import './App.css';
import Notes from './Notes.js';
import Form from './Form.js';
import { config_db } from './config';
//!!!!!!!!!!!! 39.25, check this one
import firebase from 'firebase/app';
import 'firebase/database';
//import for named export


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

  /* whenever an element is rendered to the DOM for the first time,
     it's called mounting in React.
     whenever the DOM produced by the element is removed, it's called
     unmounting in React.

     used https://reactjs.org/docs/state-and-lifecycle.html for reference
  */

  //method for when the component mounts (before render)
  //using componentDidMount since WillMount is deprecated

  componentDidMount(){
    //at first, we have the previousNotes being set to what we currently have
    const previousNotes = this.state.notesArr;
    //whenever child gets added to notesArr db we push
    //from this database (our previous notesArr) to the notesArr array
    //from firebase docs: Writing is done with the set() method
    //and reading can be done with the on()


    /*anytime we read data from database we receive that data
      in the form of a data snapshot object, which we pass here
      we inspect the data by using the val method*/
    this.database.on('child_added', snap => {
      previousNotes.push({
        //the following are key,value pairs
        //we use id to get the snapshotkey
        //and notesContent has the value of the notesArr
        id: snap.key, //a unique id provided by firebase
        notesContent: snap.val().notesContent,
      })

      //now update the setState
      this.setState({
          notesArr: previousNotes
      })
      /*when new child added to notesArr DB we get a
      //snapshot of that data , we grab the unique key
      //and we get the content and push that onto the previousNotes array
      //the child_added is triggered by the createNote */
    })

    //for removing items
    this.database.on('child_removed', snap => {
      //we will identify the item we want to delete by usng the note id
      for (var i = 0; i < previousNotes.length; i++) {
        //if this particular note element has the same id is he 'child removed'
        //item that we clicked to remove, then it deletes it from the array
        //deleting it happens with the splice() method
        //snap.key will give us he key of the removed item
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
    //we set the notesContent to be what we pass it to this method
    //i.e the note, that we get from the input form
    this.database.push().set({ notesContent: note});
    /*push this note to the array of notesArr, old code, before
    //using the database

    var updateStateNotes = this.state.note;
    updateStateNotes.push(note);
    //update the state to this new state after the note has been created
    this.setState({notesArr: updateStateNotes});
    */

    /*used this as reference
    var joined = this.state.myArray.concat('new value');
    this.setState({ myArray: joined })
    */
  }
  //we pass it the notesId, not the contents, since the db will look at the
  //id when removing it, not at its value
  removeNote(notesId){
    //notesArr are children in the db
    this.database.child(notesId).remove();
  }

  render() {
    return (
      <div className="wrapper">
        <div className="header">
          <h1>Todo list </h1>
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
        <div className="notesFooter">

          <Form createNote={this.createNote}/>
        </div>
      </div>
    );
  }
}

export default App;
