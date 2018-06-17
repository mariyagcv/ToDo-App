import React, { Component } from 'react';
import './index.css'

//used https://reactjs.org/docs/forms.html for reference!

class Form extends Component {
  constructor (props)
  {
    super(props);
    /*state for the input, we want the state to be related
    with creating a new note
    the user starts typing, the value will of newContent will change
    to the value of the input */
    this.state = {newContent: '',};
    this.handleInputChange = this.handleInputChange.bind(this);
    this.writeNewNote= this.writeNewNote.bind(this);
  }

  //when the user starts typing, we set the note content to
  //what the user inputs
  handleInputChange(event){
    this.setState({
      newContent: event.target.value,
    })
  }

  writeNewNote(){
    //calling the createNote method from the parent element
    //and passing it the newContent (i.e the new note)
    this.props.createNote(this.state.newContent);
    //sets the state (the content) to an empty string
    //so that after a note is written, the input box will be cleared
    this.setState({
      newContent: '',
    })
  }

  render (){
    return (
      <div className="wrapForm">
      <div className="flex-grid">
        <div className="col">
        <input className = "noteInput" placeholder= "Add a task"
        value={this.state.newContent}
        onChange={this.handleInputChange}/>
        </div>
          <div className="col">
        <button className = "btn center"
        onClick = {this.writeNewNote}>Add</button>
          </div>
          </div>
      </div>
    )
  }
}

export default Form;
