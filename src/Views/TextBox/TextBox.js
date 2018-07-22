import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../GameView.css'
import './TextBoxView.css'
import Typed from 'react-typed';
class TextBox extends Component {
    constructor() {
        super(...arguments);
    }
    componentWillUpdate() {
        this.typed.reset();
    }
    componentWillUnmount() {
        if (this.hasOwnProperty('typed') || this.typed !== undefined) {
            this.typed.destroy();
        }
    }
    render() {
        return (<div className="App">
            <p className="App-title" id="SectionName">{this.props.SectionName}</p>
            <Link to='/' className="App-title">返回到章节选择</Link>
            <div className="TextBox" onMouseDown={() => this.props.MouseEventTrigger({ Mouse: true })}>
                <p className="App-intro" id="CharacterName">{this.props.CharacterName}</p>
                <Typed typedRef={(typed) => { this.typed = typed; }} strings={[this.props.TextContent]} typeSpeed={40} showCursor={false}>
                    <p className="App-intro" />
                </Typed>
            </div>
        </div>);
    }
}
export default TextBox;