import React, { Component } from 'react';
import { connect } from 'react-redux';
import TransitionGroup from 'react-addons-css-transition-group';
import * as Actions from '../../Engine/SectionActions'
import * as Status from '../../Engine/Status'
import { TextNodeInterpreter } from '../../Engine/LoadSection';
import { Scene, TextBox, Loading } from '../index';
import { GetRemoteUrlPath } from '../../Engine/Util';
import safetouch from 'safe-touch';
import { Link } from 'react-router-dom';
import * as EventsType from '../../Engine/Events';
class GameView extends Component {
	constructor() {
		super(...arguments);
		this.state = { Scene: null, BGM: null, SectionName: null, CharacterName: null, Text: null, SelectionArray: null, IsInSelection: false };

		//游戏画面控制函数
		this.ChangeNode = this.ChangeNode.bind(this);
		this.ApplyTextToView = this.ApplyTextToView.bind(this);
		this.GetNewTextNode = this.GetNewTextNode.bind(this);
		this.InitPreloadResources = this.InitPreloadResources.bind(this);
		this.BlockKeyEventInAnimation = this.BlockKeyEventInAnimation.bind(this);
		this.GetStatusFlag = this.GetStatusFlag.bind(this);
		this.GetTypingStatus = this.GetTypingStatus.bind(this);
		this.SetStopTypingController = this.SetStopTypingController.bind(this);
		this.ApplySelectionToView = this.ApplySelectionToView.bind(this);
		this.SaveState = this.SaveState.bind(this);
		//当前节点状态
		this.NeedNewSection = null;
		this.NodeIndex = null;
		//节点解析器的回调函数
		this.MiddleWareCallbackFuncArr = [null, this.ApplyTextToView, this.ApplySelectionToView, this.GetStatusFlag];
		this.BlockKeyEvent = false;
		//打字机特效控制函数
		this.TypingController = { Stopper: null, IsTyping: 0 };
	}
	GetStatusFlag(StatusObj) {
		this.NeedNewSection = StatusObj.Flag;
		this.NodeIndex = StatusObj.Index;
	}
	ChangeNode(event) {
		if (this.BlockKeyEvent === true) return;
		else if (this.TypingController.IsTyping === 1) {
			this.TypingController.Stopper();
			return;
		}
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
		let NextTextContent = NodeProps.TextContent;
		if (NextTextContent.TextMode === 'new') {
			this.setState(NextTextContent);
		} else if (NextTextContent.TextMode === 'append') {
			this.setState({ ...NextTextContent, Text: this.state.Text + NextTextContent.Text });
		}
	}
	ApplySelectionToView(NodeProps) {
		if (NodeProps === null) {
			if (this.state.IsInSelection !== false) {
				this.setState({ IsInSelection: false });
			}
			else return;
		}
		else {
			this.setState({ SelectionArray: NodeProps, IsInSelection: true });
		}
	}
	InitPreloadResources(PreloadResourcesObj) {
		for (var key in PreloadResourcesObj) {
			if (PreloadResourcesObj[key] !== null) {
				PreloadResourcesObj[key] = GetRemoteUrlPath(PreloadResourcesObj[key]);
			}
		}
		this.setState(PreloadResourcesObj);
	}
	BlockKeyEventInAnimation(event) {
		this.BlockKeyEvent = event;
	}
	GetTypingStatus(StatusCode) {
		//1是正在执行打字机效果，0是执行完成
		this.TypingController.IsTyping = StatusCode;
	}
	SetStopTypingController(ControllerFunc) {
		this.TypingController.Stopper = ControllerFunc;
	}
	SaveState(CreateSaveData) {
		var FreezeState = { ...this.state, NodeIndex: this.NodeIndex };
		if(CreateSaveData!==undefined){
			const PrevInfo = require('../../Engine/StatusMachine').GetGlobalVar();
			FreezeState = {...FreezeState,PrevInfo};
		}
		this.props.onSaveCurrentState(FreezeState);
	}
	componentDidMount() {
		// let state = safetouch(this.props.location.state);
		let Chapter,Branch,Section,SaveDataInfo;
		Chapter = safetouch(this.props.location.state).Chapter();
		Branch = safetouch(this.props.location.state).Branch();
		Section = safetouch(this.props.location.state).Section();
		SaveDataInfo = safetouch(this.props.location.state).SaveInfo();

		//有三种情况，1，从指定的位置开始，2，读取存档，3，从别的页面跳回来的时候恢复数据。
		if (this.props.PreviousState !== undefined && this.props.PreviousState !== null) {
			let PrevState = this.props.PreviousState;
			this.setState(PrevState);
			TextNodeInterpreter(this.props.Section,
				Actions.SetNodeIndex(PrevState.NodeIndex),
				this.MiddleWareCallbackFuncArr);
			this.props.onClearGameViewState();//加载完了之后退出。
		}
		else if(SaveDataInfo!==undefined){
			//加载从存档页（现在的全部章节页）传来的初始化信息。
			let TmpInfo = Object.assign({}, SaveDataInfo);//deep copy
			delete TmpInfo['PrevInfo'];
			this.props.onLoadSaveData(SaveDataInfo);
			this.setState(TmpInfo);
		}
		else{
			this.props.onLoadSectionRes(Chapter, Branch, Section);
		}
		window.addEventListener('keydown', this.ChangeNode);
	}
	componentWillUnmount() {
		this.props.onLeaveGameView();
		window.removeEventListener('keydown', this.ChangeNode);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.Section !== null && nextProps.GameViewStatus !== Status.LOADING) { //检查现在应不应该把新资源应用上去。
			if (nextProps.Section !== this.props.Section) {//从其他页面跳回来的情况下就不用初始化资源了。
				var InitIndex = 0;
				let SaveDataInfo = safetouch(this.props.location.state).SaveInfo();
				if(SaveDataInfo===undefined){
					this.InitPreloadResources(nextProps.Section.PreloadResources);
					if (this.props.Section === null) {
						let UrlState = safetouch(this.props.location.state)();
						InitIndex = UrlState.TextNodeBegin;
					}
				}
				else{
					InitIndex = this.props.location.state.SaveInfo.NodeIndex;
					this.props.location.state.SaveInfo=undefined;//读过一次就删掉了
				}
				TextNodeInterpreter(nextProps.Section,
					Actions.SetNodeIndex(InitIndex),
					this.MiddleWareCallbackFuncArr);
			}
		}
	}/*
	 * 从GameView跳到存档界面的时候肯定是要保存先前状态的，这个时候存档机只需要读已经被snapshot的当前状态，写进文件就OK。
	 */
	render() { 
		return (
			<TransitionGroup
				transitionName="fade"
				transitionEnterTimeout={500}
				transitionLeave={false}
				transitionAppear={true}
				transitionAppearTimeout={500}
			>
				{
					(() => {
						switch (this.props.GameViewStatus) {
							case Status.SUCCESS: {
								this.BlockKeyEventInAnimation(this.state.IsInSelection);
								return (
									<Scene key={2} BG={this.state.Scene} IsInSection={this.state.IsInSelection}>
										{this.state.IsInSelection ?
											<div className="SelectionFlow">
												{this.state.SelectionArray.map((item, idx) =>
													(
														<button key={idx} className="button" onClick={() => {
															const { Chapter, Branch, Section } = item.JumpTo;
															this.props.onLoadSectionRes(Chapter, Branch, Section);
														}}>{item.Text}</button>
													)
												)}
											</div>
											:
											<div>
												<TextBox
													SectionName={this.props.Section.Header.SectionName}
													CharacterName={this.state.CharacterName}
													TextContent={this.state.Text}
													MouseEventTrigger={this.ChangeNode}
													SetTypingStatus={this.GetTypingStatus}
													GetStopTyping={this.SetStopTypingController}
												/>
												<Link to='/settings' className="button" onClick={()=>this.SaveState(1)}>跳转到设置</Link>
											</div>}
									</Scene>);
							}
							case Status.LOADING: {
								this.BlockKeyEventInAnimation(true);
								return (<Loading key={1} LoadingImage={this.props.Section.LoadingImage} />);
							}
							default: {
								return <p key={3}>{"Loading"}</p>;
							}
						}
					}).call(this, null)
				}
			</TransitionGroup>
		)
	}
}
const mapStateToProps = (StoreState) => {
	return {
		GameViewStatus: StoreState.GameView.status,
		Section: StoreState.GameView.Section,
		PreviousState: StoreState.GameView.PrevState
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onLoadSaveData:(SaveDataInfo)=>{
			dispatch(Actions.ReloadStoreSection(SaveDataInfo));
		},
		onLoadSectionRes: (Chapter, Branch, Section) => {
			dispatch(Actions.GetSelectedSection(Chapter, Branch, Section));
		},
		onLoadNextSection: () => {
			dispatch(Actions.GetNextSection());
		},
		onLeaveGameView: () => {
			dispatch(Actions.LeaveGameView());
		},
		onSaveCurrentState: (FreezeState) => {
			dispatch(Actions.SaveGameViewState(FreezeState));
		},
		onClearGameViewState: () => {
			dispatch(Actions.ClearGameViewPrevState());
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GameView);