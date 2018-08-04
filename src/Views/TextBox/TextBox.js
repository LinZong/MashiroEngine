import React, { Component } from 'react';
import './TextBoxView.css'
import Typed from 'react-typed';
import { Card, Button } from 'antd';
import { NavLink } from 'react-router-dom';
class TextBox extends Component {
    constructor() {
        super(...arguments);
        this.StopTyping = this.StopTyping.bind(this);
    }
    componentWillUpdate() {
        this.typed.reset();
    }
    componentWillUnmount() {
        if (this.hasOwnProperty('typed') || this.typed !== undefined) {
            this.typed.destroy();
        }
    }
    componentDidMount() {
        this.props.GetStopTyping(this.StopTyping);
    }
    StopTyping() {
        this.typed.destroy();
        document.getElementById("Text").innerText = this.props.TextContent;
    }
    render() {
        return (<div>
            <p className="TextBox-title" id="SectionName">{this.props.SectionName}</p>
            <div className="TextBox">
                <Card className="TextBox-card" title={this.props.CharacterName} bordered={false} onMouseDown={() => this.props.MouseEventTrigger({ Mouse: true })}>
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
                </Card>
                <NavLink to='/NewSettings'>
                    <Button icon='arrow-left large' shape='circle' />
                </NavLink>
            </div>
        </div>);
    }
}
export default TextBox;