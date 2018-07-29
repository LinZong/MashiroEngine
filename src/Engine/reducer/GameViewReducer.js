import * as ActionTypes from '../Events';
import * as Status from '../Status';
export default (state={}, action) => {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_PLAYING_SECTION:{
      return {...state,status:Status.SUCCESS,Section:action.Section};
    }
    case ActionTypes.NOW_LOADING:{
      return {...state,status:Status.LOADING};  
    }
    case ActionTypes.LEAVE_GAMEVIEW:{
      return {status:Status.LEAVED,Section:null,PrevState:null}
    }
    case ActionTypes.PAUSE_GAMEVIEW:{
      return {...state,status:Status.LEAVED}
    }
    case ActionTypes.CLEAR_GAMEVIEW_STATE:{
      return {...state,PrevState:null,status:Status.SUCCESS}
    }
    case ActionTypes.SAVE_GAMEVIEW_STATE:{
      return {...state,PrevState:action.StateForSave};
    }
    default:return state;
  }
}