import React from 'react';
import Typed from 'react-typed';
import { ControlFunctionContext } from '../GameView/GameView';
import './PlainText.css';
class PlainText extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			TextArray: typeof this.props.CurrentText === 'object' ? this.props.CurrentText : [this.props.CurrentText]
		}
		this.StopTyping = this.StopTyping.bind(this);
		this.ScrollToEnd = this.ScrollToEnd.bind(this);
		this.TypeSpeed = window.electron.remote.getGlobal('SettingsNode')['TEXT_SETTING']['SettingElement']['LeftCol'][0].Value;
		this.ScrollIntervalHandle = null;
	}
	ScrollToEnd() {
		this.DocumentRoot.scrollTop = this.DocumentRoot.scrollHeight;
	}
	componentDidMount() {
		this.props.GetStopTyping(this.StopTyping);
		this.DocumentRoot = document.getElementsByClassName('PlainText')[0];
	}
	componentWillReceiveProps(nextProps, nextState) {
		if (nextProps.CurrentText !== this.props.CurrentText) {
			if (typeof nextProps.CurrentText === 'object' && nextProps.Rollback) {
				this.setState({ TextArray: nextProps.CurrentText });
				//表明此时要回退
			}
			else {
				let New = this.state.TextArray;
				if (nextProps.Rollback) {
					New.pop();
					this.setState({ TextArray: New });
				}
				else {
					New.push(nextProps.CurrentText);
					this.setState({ TextArray: New })
				};
			}
		}
	}
	StopTyping() {
		this.typed.destroy();
		this.ScrollToEnd();
		clearInterval(this.ScrollIntervalHandle);
		document.getElementById("CurrentText").innerText = this.props.CurrentText;
	}
	componentWillUnmount() {
		if (this.hasOwnProperty('typed') || this.typed !== undefined) {
			this.typed.destroy();
		}
		clearInterval(this.ScrollIntervalHandle);
	}
	componentDidUpdate() {
		this.ScrollToEnd();
	}
	render() {
		return (
			<ControlFunctionContext.Consumer>
				{Func =>
					<div id="ScrollWrapper">
						<div className="PlainText">
							{
								this.state.TextArray.map((it, idx) => {
									return idx < this.state.TextArray.length - 1 || (this.props.Rollback || this.props.DisableTypeEffect) ? (<p key={idx} className="OriginalText">{it}</p>) : (
										<Typed
											typedRef={(typed) => { this.typed = typed; }}
											key={idx}
											strings={[it]}
											typeSpeed={this.TypeSpeed}
											showCursor={false}
											preStringTyped={() => {
												Func.SetTypingStatus(1)
												this.ScrollIntervalHandle = setInterval(() => {
													this.ScrollToEnd();
												}, 50);
											}}
											onComplete={() => {
												this.ScrollToEnd();
												Func.SetTypingStatus(0)
												clearInterval(this.ScrollIntervalHandle);
											}}
											onDestroy={() => Func.SetTypingStatus(0)}>
											<p className="OriginalText" id="CurrentText" key={idx} />
										</Typed>
									)
								}, this)
							}
						</div>
					</div>}
			</ControlFunctionContext.Consumer>
		);
	}
}

export default PlainText;