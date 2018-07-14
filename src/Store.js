import {createStore, combineReducers, applyMiddleware, compose} from 'redux';

import reducer from './Engine/';

import Perf from 'react-addons-perf'

const win = window;
win.Perf = Perf

const middlewares = [];
if (process.env.NODE_ENV !== 'production') {
  middlewares.push(require('redux-immutable-state-invariant')());
}

const storeEnhancers = compose(
  applyMiddleware(...middlewares),
  (win && win.devToolsExtension) ? win.devToolsExtension() : (f) => f,
);

const initialState = {
    'NodeIndexer':0
}
export default createStore(reducer, initialState, storeEnhancers);

