import React, { Component } from 'react';
import './TextBoxView.css'
import Typed from 'react-typed';
import { Card } from 'antd';
import ControlButton from './ControlButton/ControlButton';
import { ControlFunctionContext } from '../GameView/GameView';
class TextBox extends Component {
    constructor() {
        super(...arguments);
        this.StopTyping = this.StopTyping.bind(this);
        this.TypeSpeed = window.electron.remote.getGlobal('SettingsNode')['TEXT_SETTING']['SettingElement']['LeftCol'][0].Value;
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
    shouldComponentUpdate(nextProps,nextState){
        return nextProps.TextContent!==this.props.TextContent||nextProps.visible!==this.props.visible;
    }
    render() {
        return (
            <div className="TextBox">
                <Card className="TextBox-card" style={{ display: this.props.visible ? 'block' : 'none' }} title={this.props.CharacterName} bordered={false} onClick={() => this.props.MouseEventTrigger({ Mouse: true })}>
                    <ControlFunctionContext.Consumer>
                        {Func => (
                            <Typed
                                typedRef={(typed) => { this.typed = typed; }}
                                strings={[this.props.TextContent]}
                                typeSpeed={this.TypeSpeed}
                                showCursor={false}
                                preStringTyped={() => Func.SetTypingStatus(1)}
                                onComplete={() => Func.SetTypingStatus(0)}
                                onDestroy={() => Func.SetTypingStatus(0)}>
                                <p className="TextBox-intro" id="Text" />
                            </Typed>
                        )}

                    </ControlFunctionContext.Consumer>
                    <ControlButton setVisible={this.props.setVisible} />
                </Card>
            </div>
        );
    }
}
export default TextBox;