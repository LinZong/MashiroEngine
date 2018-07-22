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
      return {status:null,Section:null}
    }
    default:return state;
  }
}