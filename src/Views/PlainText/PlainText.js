import React from 'react';
import Typed from 'react-typed';
import { ControlFunctionContext } from '../GameView/GameView';
import './PlainText.css';
class PlainText extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			TextArray: [this.props.CurrentText]
		}
		this.StopTyping = this.StopTyping.bind(this);
		this.TypeSpeed = window.electron.remote.getGlobal('SettingsNode')['TEXT_SETTING']['SettingElement']['LeftCol'][0].Value;

	}
	//组件内部维护一个文本数组，按顺序记录所有被放进了CurrentText 的Prop的文本，就好像Stack一样，控制最后的一段文本有打字机效果，其他的文本是普通的<p>
	componentDidMount() {
		//TextArray.push(this.props.CurrentText);
		this.props.GetStopTyping(this.StopTyping);
	}
	componentWillReceiveProps(nextProps, nextState) {
		if (nextProps.CurrentText !== this.props.CurrentText) {
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
	StopTyping() {
		this.typed.destroy();
		document.getElementById("Text").innerText = this.props.CurrentText;
	}
	componentWillUnmount() {
		if (this.hasOwnProperty('typed') || this.typed !== undefined) {
			this.typed.destroy();
		}
	}
	render() {
		return (
			<ControlFunctionContext.Consumer>
				{Func =>
					<div className="PlainText" onClick={() => this.props.MouseEventTrigger({ Mouse: true })}>
						{
							this.state.TextArray.map((it, idx) => {
								return idx < this.state.TextArray.length - 1 || this.props.Rollback ? (<p key={idx}>{it}</p>) : (
									<Typed
										typedRef={(typed) => { this.typed = typed; }}
										key={idx}
										strings={[it]}
										typeSpeed={this.TypeSpeed}
										showCursor={false}
										preStringTyped={() => Func.SetTypingStatus(1)}
										onComplete={() => Func.SetTypingStatus(0)}
										onDestroy={() => Func.SetTypingStatus(0)}>
										<p id="Text" />
									</Typed>
								)
							}, this)
						}
					</div>}
			</ControlFunctionContext.Consumer>
		);
	}
}

export default PlainText;