import { NEXT_NODE, PREV_NODE, SET_NODE_INDEX } from './SectionActionTypes';

export const NextNode = () => ({
  type: NEXT_NODE,
});

export const PrevNode = () => ({
  type: PREV_NODE,
});

export const SetNodeIndex = (Indexer) =>
  ({
    type: SET_NODE_INDEX,
    SetIndex: Indexer
  });