import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import logo from '../logo.svg';
import './GameView.css';
import * as Actions from '../Engine/SectionActions'


const { TextNodeInterpreter } = require('../Engine/LoadSection');

class GameView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { CharacterName: '', Text: '' };
    this.ChangeNode = this.ChangeNode.bind(this);
    this.ApplyTextToNodes = this.ApplyTextToNodes.bind(this);
  }
  ChangeNode(event) {
    if (event.keyCode) {
      switch (event.keyCode) {
        case 13:
        case 39:
        case 40: {
          TextNodeInterpreter(this.props.Section, Actions.NextNode(), this.ApplyTextToNodes);
          break;
        }
        case 37:
        case 38: {
          TextNodeInterpreter(this.props.Section, Actions.PrevNode(), this.ApplyTextToNodes);
          break;
        }
        default: break;
      }
    }
  }
  ApplyTextToNodes(NodeProps) {
    if (NodeProps.TextMode === 'new') {
      this.setState(NodeProps);
    } else if (NodeProps.TextMode === 'append') {
      this.setState({ ...this.state, Text: this.state.Text + NodeProps.Text });
    }
  }
  componentDidMount() {
    let state = this.props.location.state;
    this.props.onLoadSectionRes(state.Chapter, state.Branch, state.Section);
    window.addEventListener('keydown', this.ChangeNode);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown',this.ChangeNode);
  }
  
  componentWillReceiveProps(nextProps){
    if(nextProps.Section!==undefined) {
      TextNodeInterpreter(nextProps.Section,Actions.SetNodeIndex(this.props.location.state.TextNodeBegin),this.ApplyTextToNodes);
    }
  }
  render() {
    return (this.props.Section === undefined ? 'Loading' : <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Link to='/'>{'返回到首页'}</Link>
        <h1 className="App-title">{this.props.Section.Header.SectionName}</h1>
      </header>
      <div className="TextBox" onMouseDown={() => TextNodeInterpreter(this.props.Section, Actions.NextNode(), this.ApplyTextToNodes)}>
        <p className="App-intro" id="CharacterName">{this.state.CharacterName}</p>
        <p className="App-intro" id="Text">{this.state.Text}</p>
      </div>
    </div>);
  }
}
const mapStateToProps = (state) => {
  return {
    status: state.status,
    Section: state.Section
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onLoadSectionRes: (Chapter, Branch, Section) => {
      dispatch(Actions.GetSelectedSection(Chapter, Branch, Section));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameView);