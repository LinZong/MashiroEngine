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
    INTERNAL_ERROR
} from './Events';

const {EventHandler} = require('./StatusMachine');

export const NextNode = () => ({
  type: NEXT_NODE,
});

export const PrevNode = () => ({
  type: PREV_NODE,
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
export const GetSelectedSection = (Chapter,Branch,Section) => {
  return (dispatch)=>{
    EventHandler.emit(GET_SELECTED_PLAYING_SECTION,dispatch,SetSelectedSection,Chapter,Branch,Section);
  }
};
export const GetNextSection = () => {
  return (dispatch)=>{
    EventHandler.emit(ENTER_NEXT_SECTION,dispatch,SetSelectedSection);
  }
};

export const ErrorHandler = (ErrorMsg) =>({
  type:INTERNAL_ERROR,
  ErrorMsg
});