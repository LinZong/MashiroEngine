import React from 'react';
import './NewTextBox.less';
import Typed from 'react-typed';
import ControlButton from './ControlButton/ControlButton';
import { ControlFunctionContext } from '../GameView/GameView';
import { GetSettingValue } from '../../Engine/LoadConfig';
class TextBox extends React.Component {
    constructor() {
        super(...arguments);
        this.StopTyping = this.StopTyping.bind(this);
        this.TypeSpeed = GetSettingValue("TEXTSPEED");
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
        document.getElementById("TextBoxText").innerText = this.props.TextContent;
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.TextContent !== this.props.TextContent || nextProps.visible !== this.props.visible || nextProps.AutoMode !== this.props.AutoMode;
    }
    render() {
        return (<div className="CardContainer" style={{ display: this.props.visible ? 'block' : 'none' }} onClick={() => this.props.MouseEventTrigger({ Mouse: true })}>
            <div className="CharacterInfo">
                <p className="CharacterName">{this.props.CharacterName}</p>
            </div>
            <div className="TextContainer">
                <ControlFunctionContext.Consumer>
                    {Func => (
                        <Typed
                            typedRef={(typed) => { this.typed = typed; }}
                            strings={[this.props.TextContent]}
                            typeSpeed={this.TypeSpeed}
                            showCursor={false}
                            preStringTyped={() => Func.SetTypingStatus(1)}
                            onComplete={() => { Func.SetTypingStatus(0); Func.TextEnd(); }}
                            onDestroy={() => { Func.SetTypingStatus(0); }}>
                            <span id="TextBoxText" />
                        </Typed>
                    )}
                </ControlFunctionContext.Consumer>
            </div>
            <div className="ControlButtonContainer">
                <span className="ControlButton">
                    <ControlButton setVisible={this.props.setVisible} AutoMode={this.props.AutoMode} />
                </span>
            </div>
        </div>);
    }
}
export default TextBox;