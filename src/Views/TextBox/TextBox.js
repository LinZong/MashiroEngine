import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './TextBoxView.css'
import Typed from 'react-typed';
class TextBox extends Component {
    constructor() {
        super(...arguments);
        this.StopTyping=this.StopTyping.bind(this);
    }
    componentWillUpdate() {
        this.typed.reset();
    }
    componentWillUnmount() {
        if (this.hasOwnProperty('typed') || this.typed !== undefined) {
            this.typed.destroy();
        }
    }
    componentDidMount(){
        this.props.GetStopTyping(this.StopTyping);
    }
    StopTyping() {
        this.typed.destroy();
        document.getElementById("Text").innerText = this.props.TextContent;
    }
    render() {
        return (<div>
            <p className="TextBox-title" id="SectionName">{this.props.SectionName}</p>
            <div className="TextBox" onMouseDown={() => this.props.MouseEventTrigger({ Mouse: true })}>
                <p className="TextBox-intro" id="CharacterName">{this.props.CharacterName}</p>
                <Typed
                    typedRef={(typed) => { this.typed = typed; }}
                    strings={[this.props.TextContent]}
                    typeSpeed={20}
                    showCursor={false}
                    preStringTyped={() => this.props.SetTypingStatus(1)}
                    onComplete={() => this.props.SetTypingStatus(0)}
                    onDestroy={() => this.props.SetTypingStatus(0)}>
                    <p className="TextBox-intro" id="Text" />
                </Typed>
            </div>
        </div>);
    }
}
export default TextBox;