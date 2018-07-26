import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import store from './Store.js'
import { BrowserRouter, Route } from 'react-router-dom';
import { AllChapterView, GameView, SettingsView } from './Views/index';
import registerServiceWorker from './registerServiceWorker';
import WelcomeView from './Views/Welcome/WelcomeView';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Route exact path='/' component={WelcomeView} />
                <Route path='/chapters' component={AllChapterView} />
                <Route path='/section' component={GameView} />
                <Route path='/settings' component={SettingsView} />
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));

if (module.hot) {
    module.hot.accept(() => {
        ReactDOM.render(
            <Provider store={store}>
                <BrowserRouter>
                    <div>
                        <Route exact path='/' component={WelcomeView} />
                        <Route path='/chapters' component={AllChapterView} />
                        <Route path='/section' component={GameView} />
                        <Route path='/settings' component={SettingsView} />
                    </div>
                </BrowserRouter>
            </Provider>
            , document.getElementById('root'));
    });
}
registerServiceWorker();
