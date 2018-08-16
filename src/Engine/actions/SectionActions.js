import {
    GET_NOW_PLAYING_SECTION,
    SET_NOW_PLAYING_SECTION,
    ENTER_NEXT_CHAPTER,
    ENTER_NEXT_SECTION,
    ENTER_PREV_CHAPTER,
    ENTER_PREV_SECTION,
    MAKE_SELECTION,
    GET_ALL_CHAPTERS,
    SET_ALL_CHAPTERS,
    NEXT_NODE,
    PREV_NODE,
    SET_NODE_INDEX,
    GET_SELECTED_PLAYING_SECTION,
    SET_SELECTED_PLAYING_SECTION,
    INTERNAL_ERROR,
    NOW_LOADING,
    LEAVE_GAMEVIEW,
    PAUSE_GAMEVIEW,
    SAVE_GAMEVIEW_STATE,
    CLEAR_GAMEVIEW_STATE,
    FINISHED_RELOAD,
    LOAD_SAVEDATA
} from '../Events';

import {GetRemoteUrlPath} from '../Util';
//测试用，将来肯定要做好默认UI读取的。
var GlobalLoading = GetRemoteUrlPath('.res\\Resources\\Theme\\UIResources\\Framework\\FakeLoading.jpg');

const {EventHandler} = require('../StatusMachine');

export const NextNode = () => ({
  type: NEXT_NODE
});
export const Loading = (LoadingImage) => ({
  type: NOW_LOADING,
  LoadingImage
});
export const PrevNode = () => ({
  type: PREV_NODE
});

export const SetNodeIndex = (Indexer) => ({
  type: SET_NODE_INDEX,
  SetIndex: Indexer
});

export const SetAllChapter = (ChapterList) =>({
  type:SET_ALL_CHAPTERS,
  ChapterList
});
export const SetSelectedSection = (Section) =>({
  type:SET_SELECTED_PLAYING_SECTION,
  Section
});
export const GetAllChapter = () => {
  return (dispatch)=>{
    EventHandler.emit(GET_ALL_CHAPTERS,dispatch,SetAllChapter);
  }
};
export const LeaveGameView = () =>({
  type:LEAVE_GAMEVIEW
});
export const PauseGameView = () =>({
  type:PAUSE_GAMEVIEW
});
export const FinishedReload = () => ({
  type:FINISHED_RELOAD
})

export const ClearGameViewState = () =>({
  type:CLEAR_GAMEVIEW_STATE
});

export const GetSelectedSection = (Chapter,Branch,Section) => {
  return (dispatch)=>{
    //Chapter是AllChapter扫了文件夹的Obj,Branch和Section都是数字
    EventHandler.emit(GET_SELECTED_PLAYING_SECTION,dispatch,SetSelectedSection,Chapter,Branch,Section);
  }
};
export const GetNextSection = (SkipLoading) => {
  return (dispatch)=>{
    !SkipLoading&&dispatch(Loading());
    setTimeout(()=>{EventHandler.emit(ENTER_NEXT_SECTION,dispatch,SetSelectedSection);},SkipLoading?0:2000);
  }
};
export const GetPrevSection = (SkipLoading) => {
  return (dispatch)=>{
    !SkipLoading&&dispatch(Loading());
    setTimeout(()=>{EventHandler.emit(ENTER_PREV_SECTION,dispatch,SetSelectedSection);},SkipLoading?0:2000);
  }
};
export const ReloadStoreSection = (SaveDataInfo) => {
  return (dispatch)=>{
    EventHandler.emit(LOAD_SAVEDATA,SaveDataInfo,dispatch,SetSelectedSection);
  }
};


export const ErrorHandler = (ErrorMsg) =>({
  type:INTERNAL_ERROR,
  ErrorMsg
});

export const SaveGameViewState = (StateForSave) => ({
  type:SAVE_GAMEVIEW_STATE,
  StateForSave
})
