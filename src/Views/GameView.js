import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './GameView.css';
import * as Actions from '../Engine/SectionActions'
import { TextNodeInterpreter } from '../Engine/LoadSection';
import TextBox from './TextBox';
class GameView extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = { SectionName:'',CharacterName: '', Text: '' };
		this.ChangeNode = this.ChangeNode.bind(this);
		this.ApplyTextToView = this.ApplyTextToView.bind(this);
		this.GetNewTextNode = this.GetNewTextNode.bind(this);
		this.NeedNewSection = null;
	}
	ChangeNode(event) {
		if (event.Mouse) {
			this.GetNewTextNode(1);
		}
		else if (event.keyCode) {
			switch (event.keyCode) {
				case 13:
				case 39:
				case 40: {
					this.GetNewTextNode(1);
					break;
				}
				case 37:
				case 38: {
					this.GetNewTextNode(-1);
					break;
				}
				default: break;
			}
		}
	}
	GetNewTextNode(Type) {
		if (this.NeedNewSection === 1 && Type === 1) {
			this.props.onLoadNextSection();
		}
		/* 按照国际惯例不允许Load Prev Section */
		else {
			switch (Type) {
				case 1: {
					TextNodeInterpreter(this.props.Section, Actions.NextNode(), this.ApplyTextToView);
					break;
				}

				case -1: {
					TextNodeInterpreter(this.props.Section, Actions.PrevNode(), this.ApplyTextToView);
					break;
				}
				default: break;
			}
		}
	}
	ApplyTextToView(NodeProps) {
		this.NeedNewSection = NodeProps.Flag;
		let ThisContent = NodeProps.TextContent;
		if (ThisContent.TextMode === 'new') {
			this.setState(ThisContent);
		} else if (ThisContent.TextMode === 'append') {
			this.setState({ ...ThisContent, Text: this.state.Text + ThisContent.Text });
		}
	}
	componentDidMount() {
		let state = this.props.location.state;
		this.props.onLoadSectionRes(state.Chapter, state.Branch, state.Section);
		window.addEventListener('keydown', this.ChangeNode);
	}
	componentWillUnmount() {
		window.removeEventListener('keydown', this.ChangeNode);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.Section !== undefined) {
			let InitIndex = 0;
			if (this.props.Section === null) InitIndex = this.props.location.state.TextNodeBegin;
			TextNodeInterpreter(nextProps.Section, Actions.SetNodeIndex(InitIndex), this.ApplyTextToView);
		}
	}
	render() {
		return (this.props.Section === undefined ? 'Loading' :
			<TextBox SectionName={this.props.Section.Header.SectionName} CharacterName={this.state.CharacterName} TextContent={this.state.Text} MouseEventTrigger={this.ChangeNode} />);
	}
}
const mapStateToProps = (state) => {
	return {
		status: state.status,
		Section: state.Section
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onLoadSectionRes: (Chapter, Branch, Section) => {
			dispatch(Actions.GetSelectedSection(Chapter, Branch, Section));
		},
		onLoadNextSection: () => {
			dispatch(Actions.GetNextSection());
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GameView);