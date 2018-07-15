import {createStore, applyMiddleware, compose} from 'redux';

import reducer from './Engine/reducer';

import thunkMiddleware from 'redux-thunk'

const middlewares = [thunkMiddleware];

const storeEnhancers = compose(
  applyMiddleware(...middlewares)
);

export default createStore(reducer, {},storeEnhancers);