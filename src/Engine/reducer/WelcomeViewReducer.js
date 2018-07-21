import * as ActionTypes from '../Events';
import * as Status from '../Status';
export default (state={}, action) => {
  switch (action.type) {
    case ActionTypes.SET_ALL_CHAPTERS: {
      return { ...state, status: Status.SUCCESS, ChapterList: action.ChapterList };
    }
    case ActionTypes.GET_ALL_CHAPTERS: {
      return { state: Status.LOADING };
    }
    default: return state;
  }
}
