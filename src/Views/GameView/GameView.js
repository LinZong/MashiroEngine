import React, { Component } from 'react';
import { connect } from 'react-redux';
import TransitionGroup from 'react-addons-css-transition-group';
import * as Actions from '../../Engine/actions/SectionActions'
import * as Status from '../../Engine/Status'
import { TextNodeInterpreter } from '../../Engine/LoadSection';
import { Scene, TextBox, Loading, Selection } from '../index';
import { GetRemoteUrlPath } from '../../Engine/Util';
import safetouch from 'safe-touch';
import './GameView.css';
const { CreateSaveData } = require('../../Engine/LoadSaveData');
var ControlFunctionContext = React.createContext();
class GameView extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			Scene: null,
			BGM: null,
			SectionName: null,
			CharacterName: null,
			Text: null,
			SelectionArray: null,
			IsInSelection: false,
			TextBoxVisible: true
		};
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
		this.ToggleTextBoxVisible = this.ToggleTextBoxVisible.bind(this);
		this.SetTextBoxVisible = this.SetTextBoxVisible.bind(this);
		this.LoadSaveData = this.LoadSaveData.bind(this);
		//当前节点状态
		this.NeedNewSection = null;
		this.NodeIndex = null;
		//节点解析器的回调函数
		this.MiddleWareCallbackFuncArr = [null, this.ApplyTextToView, this.ApplySelectionToView, this.GetStatusFlag];
		this.BlockKeyEvent = false;
		//打字机特效控制函数
		this.TypingController = { Stopper: null, IsTyping: 0 };
		this.ControlFunction = {
			GetNewTextNode: this.GetNewTextNode,
			setState: this.setState,
			SaveState: this.SaveState,//Q.Save
			LoadSaveData: this.LoadSaveData,//这个是给Q.Load用的
			SetTextBoxVisible: this.SetTextBoxVisible
		};
	}
	GetStatusFlag(StatusObj) {//Read-only
		this.NeedNewSection = StatusObj.Flag;
		if (this.NeedNewSection) {
			//this.props.history.replace('/section/next');
			this.props.match.params.load = 'next';
		}
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
				this.setState({ IsInSelection: false, SelectionArray: null });
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
	SaveState() {
		let FreezeState = { ...this.state, NodeIndex: this.NodeIndex };
		delete FreezeState['load'];
		const contents = window.electron.remote.getCurrentWindow().webContents;
		const PrevInfo = require('../../Engine/StatusMachine').GetGlobalVar();
		let now = new Date();
		FreezeState = { ...FreezeState, PrevInfo, TimeStamp: now.toLocaleString() };
		contents.capturePage((image) => {
			console.log('成功暂存数据');
			FreezeState = { ...FreezeState, Image: image }
			this.props.onSaveCurrentState(FreezeState);
		});
		return FreezeState;
	}
	componentDidMount() {
		// let state = safetouch(this.props.location.state);
		let LoadType = this.props.match.params.load;
		switch (LoadType) {
			case 'next':
			case 'new': {
				let Chapter, Branch, Section;
				Chapter = safetouch(this.props.location.state).Chapter();
				Branch = safetouch(this.props.location.state).Branch();
				Section = safetouch(this.props.location.state).Section();
				this.props.onLoadSectionRes(Chapter, Branch, Section);
				break;
			}
			case 'save': {
				let SaveDataInfo = safetouch(this.props.location.state).SaveInfo();
				this.LoadSaveData(SaveDataInfo);
				break;
			}
			case 'prev': {
				let PrevState = this.props.PreviousState;
				this.setState(PrevState);
				TextNodeInterpreter(this.props.Section,
					Actions.SetNodeIndex(PrevState.NodeIndex),
					this.MiddleWareCallbackFuncArr);
				this.props.onFinishedReload();//加载完了之后退出。
				break;
			}
		}
		window.addEventListener('keydown', this.ChangeNode);
	}
	componentWillUnmount() {
		this.SaveState();
		this.props.onPauseGameView();
		window.removeEventListener('keydown', this.ChangeNode);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.Section && nextProps.GameViewStatus === Status.SUCCESS) { //检查现在应不应该把新资源应用上去。
			if (nextProps.Section === this.props.Section && !safetouch(this.props.location.state).SaveInfo()) return;
			let LoadType = this.props.match.params.load;
			switch (LoadType) {
				case 'next':
				case 'new': {
					let InitIndex = this.props.Section ? 0 :
						safetouch(this.props.location.state)().TextNodeBegin;
					this.InitPreloadResources(nextProps.Section.PreloadResources);
					TextNodeInterpreter(nextProps.Section,
						Actions.SetNodeIndex(InitIndex),
						this.MiddleWareCallbackFuncArr);
					break;
				}
				case 'save': {
					this.InitPreloadResources(nextProps.Section.PreloadResources);
					let InitIndex = this.props.location.state.SaveInfo.NodeIndex;
					this.props.location.state.SaveInfo = undefined;//读过一次就删掉了
					TextNodeInterpreter(nextProps.Section,
						Actions.SetNodeIndex(InitIndex),
						this.MiddleWareCallbackFuncArr);
					break;
				}
				case 'prev': {
					break;
				}
			}
		}
	}
	ToggleTextBoxVisible() {
		if (!this.state.TextBoxVisible) {
			this.setState({ TextBoxVisible: true });
		}
	}
	SetTextBoxVisible(visible) {
		this.setState({ TextBoxVisible: visible });
	}
	LoadSaveData(SaveData) {
		let TmpInfo = Object.assign({}, SaveData);//deep copy
		delete TmpInfo['PrevInfo'];
		this.props.onLoadSaveData(SaveData);
		this.setState(TmpInfo);
	}
	/*
	 * 从GameView跳到存档界面的时候肯定是要保存先前状态的，这个时候存档机只需要读已经被snapshot的当前状态，写进文件就OK。
	 */
	render() {
		return (
			<ControlFunctionContext.Provider value={this.ControlFunction}>
				<TransitionGroup
					transitionName="GameViewFade"
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
										<Scene key={2} BG={this.state.Scene} IsInSection={this.state.IsInSelection} onClick={this.ToggleTextBoxVisible}>
											{this.state.IsInSelection ?
												<Selection SelectionArray={this.state.SelectionArray} onLoadSectionRes={this.props.onLoadSectionRes} />
												:
												<TextBox
													SectionName={this.props.Section.Header.SectionName}
													CharacterName={this.state.CharacterName}
													TextContent={this.state.Text}
													MouseEventTrigger={this.ChangeNode}
													SetTypingStatus={this.GetTypingStatus}
													GetStopTyping={this.SetStopTypingController}
													visible={this.state.TextBoxVisible}
												/>
											}
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
			</ControlFunctionContext.Provider>
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
		onLoadSaveData: (SaveDataInfo) => {
			dispatch(Actions.ReloadStoreSection(SaveDataInfo));
		},
		onLoadSectionRes: (Chapter, Branch, Section) => {
			dispatch(Actions.GetSelectedSection(Chapter, Branch, Section));
		},
		onLoadNextSection: () => {
			dispatch(Actions.GetNextSection());
		},
		onPauseGameView: () => {
			dispatch(Actions.PauseGameView());
		},
		onLeaveGameView: () => {
			dispatch(Actions.LeaveGameView());
		},
		onSaveCurrentState: (FreezeState) => {
			dispatch(Actions.SaveGameViewState(FreezeState));
		},
		onFinishedReload: () => {
			dispatch(Actions.FinishedReload());
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GameView);

export { ControlFunctionContext };