import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './GameView.css'
const TextBox = ({ SectionName,CharacterName, TextContent, MouseEventTrigger }) => (
    <div className="App">
        <Link to='/'>返回到章节选择</Link>
        <div className="TextBox" onMouseDown={() => MouseEventTrigger({ Mouse: true })}>
            <p className="App-title" id="SectionName">{SectionName}</p>
            <p className="App-intro" id="CharacterName">{CharacterName}</p>
            <p className="App-intro" id="Text">{TextContent}</p>
        </div>
    </div>
);
export default TextBox;