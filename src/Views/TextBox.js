import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './GameView.css'
import './TextBoxView.css'
const TextBox = ({ SectionName, CharacterName, TextContent, MouseEventTrigger }) => (
    <div className="App">
        <p className="App-title" id="SectionName">{SectionName}</p>
        <Link to='/' className="App-title">返回到章节选择</Link>
        <div className="TextBox" onMouseDown={() => MouseEventTrigger({ Mouse: true })}>
            <p className="App-intro" id="CharacterName">{CharacterName}</p>
            <p className="App-intro" id="Text">{TextContent}</p>
        </div>
    </div>
);
export default TextBox;