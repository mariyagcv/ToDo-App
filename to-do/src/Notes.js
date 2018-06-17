import React, { Component } from 'react';
import './index.css'
//facilitates type checking for props we pass to components
import PropTypes from 'prop-types';
import Form from './Form.js';

class Notes extends Component{
  constructor(props){
    super(props);
    this.notesContent = props.notesContent; //will get note notesContent from props
    this.notesId = props.notesId;
  }

  handleRemoveItem(id){
    //the method is bound to the parent and passed as a prop to the child
    //i.e that's a way of calling a parent method from the child
    this.props.removeNote(id);
  }
  //renders the elements 
  render(props){
    return(
      <div className="noteStyle">
        <span className="closebtn"
        onClick={() => this.handleRemoveItem(this.notesId) }>X</span>
        <p className="notesContent">{this.notesContent}</p>
      </div>
    )
  }
}

Notes.propTypes = {
  notesContent: PropTypes.string //making sure we're passing string for the notes
}
export default Notes;
