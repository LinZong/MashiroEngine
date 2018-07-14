import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { NextNode, PrevNode, SetNodeIndex } from './Engine/SectionActions';
import * as IPCEVENTS from './Engine/Events';

const electron = window.electron;
const { ipcRenderer } = electron;

let NowPlayingSection;
const TextNodeInterpreter = require('./Engine/LoadSection');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { CharacterName: '', Text: '' };
    this.PrevState = {};
    this.NodeProp = {};
    this.ChangeNode = this.ChangeNode.bind(this);
    this.ApplyTextToNodes = this.ApplyTextToNodes.bind(this);
    ipcRenderer.send(IPCEVENTS.GET_NOW_PLAYING_SECTION);
    ipcRenderer.on(IPCEVENTS.SET_NOW_PLAYING_SECTION, (event, args) => {
      NowPlayingSection = args;
      TextNodeInterpreter(NowPlayingSection, SetNodeIndex(0), this.ApplyTextToNodes);
    });
  }

  ChangeNode(event) {
    if (event.keyCode) {
      switch (event.keyCode) {
        case 13:
        case 39:
        case 40: {
          TextNodeInterpreter(NowPlayingSection, NextNode(), this.ApplyTextToNodes);
          break;
        }
        case 37:
        case 38: {
          TextNodeInterpreter(NowPlayingSection, PrevNode(), this.ApplyTextToNodes);
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
    window.addEventListener('keydown', this.ChangeNode);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">苏希烔保佑代码无Bug</h1>
        </header>
        <div className="TextBox" onMouseDown={() => TextNodeInterpreter(NowPlayingSection, NextNode(), this.ApplyTextToNodes)}>
          <p className="App-intro" id="CharacterName">{this.state.CharacterName}</p>
          <p className="App-intro" id="Text">{this.state.Text}</p>
        </div>
      </div>
    );
  }
}
export default App;