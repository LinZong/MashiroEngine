import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './GameView.css';
import * as Actions from '../Engine/SectionActions'
import { TextNodeInterpreter } from '../Engine/LoadSection';

class GameView extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = { CharacterName: '', Text: '' };
		this.ChangeNode = this.ChangeNode.bind(this);
		this.ApplyTextToNodes = this.ApplyTextToNodes.bind(this);
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
					TextNodeInterpreter(this.props.Section, Actions.NextNode(), this.ApplyTextToNodes);
					break;
				}

				case -1: {
					TextNodeInterpreter(this.props.Section, Actions.PrevNode(), this.ApplyTextToNodes);
					break;
				}
				default: break;
			}
		}
	}
	ApplyTextToNodes(NodeProps) {
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
			TextNodeInterpreter(nextProps.Section, Actions.SetNodeIndex(InitIndex), this.ApplyTextToNodes);
		}
	}
	render() {
		return (this.props.Section === undefined ? 'Loading' : <div className="App">
			<Link to='/'>返回到章节选择</Link>
			<div className="TextBox" onMouseDown={() => this.ChangeNode({ Mouse: true })}>
				<p className="App-intro" id="CharacterName">{this.state.CharacterName}</p>
				<p className="App-intro" id="Text">{this.state.Text}</p>
			</div>
		</div>);
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