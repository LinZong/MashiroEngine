import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import TransitionGroup from 'react-addons-css-transition-group';
import * as Actions from '../../Engine/actions/SectionActions'
import * as Status from '../../Engine/Status'
import { TextNodeInterpreter } from '../../Engine/LoadSection';
import { Scene, TextBox, Loading, Selection,Backlog, PlainText, Character } from '../index';
import { GetRemoteUrlPath, copy } from '../../Engine/Util';
import safetouch from 'safe-touch';
import Audio from '../Audio/Audio';
import './GameView.css';
const { GetSettingValue } = require('../../Engine/LoadConfig');
var ControlFunctionContext = React.createContext();
class GameView extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			Scene: [],
			BGM: [],
			Character: [],
			Text: null,
			CharacterVoice: null,
			SelectionArray: null,
			NowMode: '',
			IsPlainTextRollback: false,
			TextBoxVisible: true,
			AutoMode: false
		};
		//游戏画面控制函数
		this.ChangeNode = this.ChangeNode.bind(this);
		this.ApplyTextToView = this.ApplyTextToView.bind(this);
		this.GetNewTextNode = this.GetNewTextNode.bind(this);
		this.InitPreloadResources = this.InitPreloadResources.bind(this);
		this.BlockKeyEvent = this.BlockKeyEvent.bind(this);
		this.GetStatusFlag = this.GetStatusFlag.bind(this);
		this.GetTypingStatus = this.GetTypingStatus.bind(this);
		this.SetStopTypingController = this.SetStopTypingController.bind(this);

		this.ApplySelectionToView = this.ApplySelectionToView.bind(this);
		this.ApplyTextToView = this.ApplyTextToView.bind(this);
		this.ApplyCharacterVoice = this.ApplyCharacterVoice.bind(this);
		this.ApplyPlainTextToView = this.ApplyPlainTextToView.bind(this);

		this.SaveState = this.SaveState.bind(this);
		this.ToggleTextBoxVisible = this.ToggleTextBoxVisible.bind(this);
		this.SetTextBoxVisible = this.SetTextBoxVisible.bind(this);
		this.LoadSaveData = this.LoadSaveData.bind(this);
		this.VoiceEnd = this.VoiceEnd.bind(this);
		this.TextEnd = this.TextEnd.bind(this);
		//当前节点状态;
		this.AutoModeCancelation = null;
		this.NeedNewSection = null;
		this.NodeIndex = null;
		//节点解析器的回调函数
		this.MiddleWareCallbackFuncArr = [null, this.InitPreloadResources, this.ApplyTextToView, this.ApplyPlainTextToView, this.ApplySelectionToView, this.ApplyCharacterVoice, this.GetStatusFlag];
		this.IsBlockKey = false;
		this.AutoModeNextNodeDelay = GetSettingValue('AutoModeNextNodeDelay');
		//打字机特效控制函数
		this.TypingController = { Stopper: null, IsTyping: 0 };
		//The New Context API is excited!
		this.ControlFunction = {
			GetNewTextNode: this.GetNewTextNode,
			setState: this.setState,
			SaveState: this.SaveState,//Q.Save
			LoadSaveData: this.LoadSaveData,//这个是给Q.Load用的
			SetTextBoxVisible: this.SetTextBoxVisible,
			SetTypingStatus: this.GetTypingStatus,
			VoiceEnd: this.VoiceEnd,
			TextEnd: this.TextEnd,
			OpenBacklog: () => { this.setState({ NowMode: 'backlog' }) },
			SetAutoModeStatus: (AutoModeBoolean) => this.setState({ AutoMode: AutoModeBoolean }),
			GetNextSection: (skip) => { this.props.match.params.load = 'next'; this.props.onLoadNextSection(skip) },
			GetPrevSection: (skip) => { this.props.match.params.load = 'next'; this.props.onLoadPrevSection(skip) }
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
		if (this.IsBlockKey) return;
		else if (this.TypingController.IsTyping === 1) {
			this.TypingController.Stopper();
			return;
		}
		this.AutoModeCancelation && clearTimeout(this.AutoModeCancelation) && (this.AutoModeCancelation = null);
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
				case 27: {//这个是用来退出特定模式
					if(this.state.NowMode==='backlog')
						this.setState({ NowMode: 'text' });
					break;
				}
				default: break;
			}
		}
	}
	GetNewTextNode(Type) {
		if (this.NeedNewSection === 1 && Type === 1) {
			this.props.onLoadNextSection.call(this, null);
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
		//if (NextTextContent.TextMode === 'new') {
		this.setState({ ...NextTextContent, NowMode: 'text' });
		// } else if (NextTextContent.TextMode === 'append') {
		// 	this.setState({ ...NextTextContent, Text: this.state.Text + NextTextContent.Text });
		// }
	}
	ApplyPlainTextToView(NodeProps) {
		this.setState({
			Text: NodeProps.TextContent,
			IsPlainTextRollback: NodeProps.Rollback,
			NowMode: 'plaintext'
		})
	}
	ApplySelectionToView(NodeProps) {
		if (NodeProps === null) {
			if (this.state.IsInSelection !== false) {
				this.setState({ SelectionArray: null });
			}
			else return;
		}
		else {
			this.setState({ SelectionArray: NodeProps, NowMode: 'selection' });
		}
	}
	ApplyCharacterVoice(VoiceProps) {
		this.setState({ CharacterVoice: VoiceProps });
	}
	InitPreloadResources(PreloadResourcesObj, Rollback, NewSection) {
		const { Scene, BGM, Character } = this.state;
		if (NewSection) {
			Scene.empty();
			BGM.empty();
			Character.empty();
		}
		for (var key in PreloadResourcesObj) {
			if (PreloadResourcesObj[key]) {
				switch (key) {
					case "Scene": {
						if (Rollback && Scene.length > 1) {
							Scene.pop();
							break;
						}
						Scene.push(GetRemoteUrlPath(PreloadResourcesObj[key]));
						break;
					}
					case "BGM": {
						if (Rollback && BGM.length > 1) {
							BGM.pop();
							break;
						}
						let BGMObj = copy(PreloadResourcesObj[key], {});//进行深复制
						BGMObj.Path = GetRemoteUrlPath(BGMObj.Path, true);
						BGM.push(BGMObj);
						break;
					}
					case "Character": {
						if (Rollback && Character.length > 1) {
							Character.pop();
							break;
						}
						let CharacterObj = Array.from(PreloadResourcesObj[key], (ele) => ({ ...ele, Path: GetRemoteUrlPath(ele.Path) }));//进行数组深复制
						Character.push(CharacterObj);
						break;
					}
				}
			}

		}
		this.setState({ Scene, BGM });
	}
	BlockKeyEvent(event) {
		this.IsBlockKey = event;
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
			clearTimeout(this.AutoModeCancelation);//去除上个section遗留的自动模式计时器
			switch (LoadType) {
				case 'next':
				case 'new': {
					let InitIndex = this.props.Section ? 0 :
						safetouch(this.props.location.state)().TextNodeBegin;
					this.InitPreloadResources(nextProps.Section.PreloadResources, false, true);
					TextNodeInterpreter(nextProps.Section,
						Actions.SetNodeIndex(InitIndex),
						this.MiddleWareCallbackFuncArr);
					break;
				}
				case 'save': {
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
	VoiceEnd(type) {
		console.log(type, '播放完了');
	}
	TextEnd() {
		if (this.state.AutoMode) {
			this.AutoModeCancelation = setTimeout(() => this.GetNewTextNode(1), this.AutoModeNextNodeDelay);
		}
	}
	/*
	 * 从GameView跳到存档界面的时候肯定是要保存先前状态的，这个时候存档机只需要读已经被snapshot的当前状态，写进文件就OK。
	 */
	render() {
		return (
			<ControlFunctionContext.Provider value={this.ControlFunction}>
				<TransitionGroup
					transitionName="GameViewFade"
					transitionEnterTimeout={700}
					transitionLeave={true}
					transitionAppear={true}
					transitionAppearTimeout={700}
				>
					{
						(() => {
							switch (this.props.GameViewStatus) {
								case Status.SUCCESS: {
									ReactDOM.render(<Audio BGM={this.state.BGM.top()} Character={this.state.CharacterVoice} onEnd={this.VoiceEnd} />, document.getElementById('music'));
									this.BlockKeyEvent(this.state.NowMode === 'selection' || !this.state.TextBoxVisible);
									return (
										<Scene key={2} BG={this.state.Scene.top()} EnableMask={this.state.NowMode !== 'text'} onClick={this.ToggleTextBoxVisible}>
											{
												//这里放Character
												<Character CharacterList={this.state.Character.top()} />}
											{
												(() => {
													switch (this.state.NowMode) {
														case 'text': {
															return <TextBox
																SectionName={this.props.Section.Header.SectionName}
																CharacterName={this.state.CharacterName}
																TextContent={this.state.Text}
																MouseEventTrigger={this.ChangeNode}
																visible={this.state.TextBoxVisible}
																GetStopTyping={this.SetStopTypingController}
																AutoMode={this.state.AutoMode}
															/>
														}
														case 'plaintext': {
															return <PlainText
																	CurrentText={this.state.Text}
																	MouseEventTrigger={this.ChangeNode}
																	GetStopTyping={this.SetStopTypingController}
																	Rollback={this.state.IsPlainTextRollback}
																/>
														}
														case 'selection': {
															return <Selection SelectionArray={this.state.SelectionArray} onLoadSectionRes={this.props.onLoadSectionRes} />
														}
														case 'backlog':{
															return <Backlog />
														}
													}
												}).call(this, null)
											}
										</Scene>);
								}
								case Status.LOADING: {
									this.BlockKeyEvent(true);
									return (<Loading key={1} LoadingImage={this.props.Section.LoadingImage} />);
								}
								default: {
									return <p key={3}>Loading</p>;
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
		onLoadNextSection: (SkipLoading) => {
			dispatch(Actions.GetNextSection(SkipLoading));
		},
		onLoadPrevSection: (SkipLoading) => {
			dispatch(Actions.GetPrevSection(SkipLoading));
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