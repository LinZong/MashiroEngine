import * as ActionTypes from './SectionActionTypes';

export default (state, action) => {
  switch (action.type) {
    case ActionTypes.NEXT_NODE:
      return {...state, NodeIndexer=NodeIndexer+1};
    case ActionTypes.PREV_NODE:
      return {...state, NodeIndexer=NodeIndexer-1};
    case ActionTypes.SET_NODE_INDEX:
      return {...state, NodeIndexer=action.SetIndex};
    default:
      return state;
  }
}