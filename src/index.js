import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import store from './Store.js'
import { BrowserRouter, Route } from 'react-router-dom';
import { WelcomeView, GameView } from './Views/index';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Route exact path='/' component={WelcomeView} />
                <Route path='/section' component={GameView} />
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));

if (module.hot) {
    module.hot.accept(()=>{
        ReactDOM.render(
            <Provider store={store}>
                <BrowserRouter>
                    <div>
                        <Route exact path='/' component={WelcomeView} />
                        <Route path='/section' component={GameView} />
                    </div>
                </BrowserRouter>
            </Provider>
            , document.getElementById('root'));
    });
}
registerServiceWorker();
