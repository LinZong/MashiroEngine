import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../GameView.css'
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
        console.log("Sent Conrtroller",this.StopTyping);
    }
    StopTyping() {
        this.typed.destroy();
        document.getElementById("Text").innerText = this.props.TextContent;
    }
    render() {
        return (<div className="App">
            <p className="App-title" id="SectionName">{this.props.SectionName}</p>
            <Link to='/' className="App-title">返回到章节选择</Link>
            <div className="TextBox" onMouseDown={() => this.props.MouseEventTrigger({ Mouse: true })}>
                <p className="App-intro" id="CharacterName">{this.props.CharacterName}</p>
                <Typed
                    typedRef={(typed) => { this.typed = typed; }}
                    strings={[this.props.TextContent]}
                    typeSpeed={40}
                    showCursor={false}
                    preStringTyped={() => this.props.SetTypingStatus(1)}
                    onComplete={() => this.props.SetTypingStatus(0)}
                    onDestroy={() => this.props.SetTypingStatus(0)}>
                    <p className="App-intro" id="Text" />
                </Typed>
            </div>
        </div>);
    }
}
export default TextBox;