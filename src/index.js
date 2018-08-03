import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import store from './Store.js'
import { BrowserRouter, Route,Switch ,Redirect } from 'react-router-dom';
import { AllChapterView, GameView,WelcomeView,Settings} from './Views/index';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Switch>
                    <Route exact path='/' component={WelcomeView} />
                    <Route path='/chapters' component={AllChapterView} />
                    <Route path='/section' component={GameView} />
                    <Route path='/settings' component={Settings} />
                    <Route path='/NewSettings' component={Settings} />
                    <Redirect to='/' />
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));

if (module.hot) {
    module.hot.accept();
}
registerServiceWorker();