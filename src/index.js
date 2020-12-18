import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { BrowserRouter } from 'react-router-dom';
import { setUpGoogleAnalytics } from './utils/Helper';

import rootReducer from './store/reducers/rootReducer'

import {cookiesExist} from './utils/Helper';

import App from './components/App'

import './resources/styles/general.scss';

import * as serviceWorker from './serviceWorker';

if (cookiesExist(['_ga', '_gid'])) {
    setUpGoogleAnalytics();
}

const store = createStore(rootReducer)

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
    
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
