import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './GameView.css';
import * as Actions from '../Engine/SectionActions'
import { TextNodeInterpreter } from '../Engine/LoadSection';
import TextBox from './TextBox';
import { Scene } from './index';
import Path from 'path';
const electron = window.electron;
class GameView extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = { Scene: null, BGM: null, SectionName: null, CharacterName: null, Text: null };
		this.ChangeNode = this.ChangeNode.bind(this);
		this.ApplyTextToView = this.ApplyTextToView.bind(this);
		this.GetNewTextNode = this.GetNewTextNode.bind(this);
		this.InitPreloadResources = this.InitPreloadResources.bind(this);
		this.KeyEventBlocker=this.KeyEventBlocker.bind(this);
		this.NeedNewSection = null;
		this.MiddleWareCallbackFuncArr = [null, this.ApplyTextToView];
		this.BlockKeyEvent=0;
	}
	ChangeNode(event) {
		if(this.BlockKeyEvent===1) return;
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
					TextNodeInterpreter(this.props.Section, Actions.NextNode(), this.MiddleWareCallbackFuncArr);
					break;
				}
				case -1: {
					TextNodeInterpreter(this.props.Section, Actions.PrevNode(), this.MiddleWareCallbackFuncArr);
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
	InitPreloadResources(PreloadResourcesObj) {
		let AppPath = electron.remote.getGlobal('Environment').AppPath;
		for (var key in PreloadResourcesObj) {
			if (PreloadResourcesObj[key] !== null) {
				PreloadResourcesObj[key] = "url(\"file:///" + Path.join(AppPath, PreloadResourcesObj[key]) + "\")";
			}
		}
		this.setState(PreloadResourcesObj);
	}
	KeyEventBlocker(event){
		switch(event.type){
			case "webkitAnimationStart":{
				this.BlockKeyEvent=1;
				break;
			}
			case "webkitAnimationEnd":{
				this.BlockKeyEvent=0;
				break;
			}
		}
	}
	componentDidMount() {
		let state = this.props.location.state;
		this.props.onLoadSectionRes(state.Chapter, state.Branch, state.Section);
		window.addEventListener('keydown', this.ChangeNode);
		window.addEventListener('webkitAnimationStart',this.KeyEventBlocker);
		window.addEventListener('webkitAnimationEnd',this.KeyEventBlocker);
	}
	componentWillUnmount() {
		window.removeEventListener('keydown', this.ChangeNode);
		window.removeEventListener('webkitAnimationStart',this.KeyEventBlocker);
		window.removeEventListener('webkitAnimationEnd',this.KeyEventBlocker);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.Section !== undefined) { //检查现在应不应该把新资源应用上去。
			this.InitPreloadResources(nextProps.Section.PreloadResources);
			let InitIndex = 0;
			if (this.props.Section === null) InitIndex = this.props.location.state.TextNodeBegin;
			TextNodeInterpreter(nextProps.Section,
				Actions.SetNodeIndex(InitIndex),
				this.MiddleWareCallbackFuncArr);
		}
	}
	render() {
		return (this.props.Section === undefined ? 'Loading' :
			<Scene BG={this.state.Scene}>
				<TextBox SectionName={this.props.Section.Header.SectionName}
					CharacterName={this.state.CharacterName}
					TextContent={this.state.Text}
					MouseEventTrigger={this.ChangeNode} />
			</Scene>);
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