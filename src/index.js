import config from '../config/config';
import '../styles/index.scss';

import reducer from './reducers/index';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Container from "./component/container";

const store = createStore(reducer);

let clockTimer, clockAttack;

document.addEventListener('keydown', (e) =>{
    if  (e.code === "KeyS") {
        store.dispatch({type:'RE-START'});
        clockTimer = setInterval(() => store.dispatch({type: 'CLOCK'}), config.game.clock);
        clockAttack = setInterval(() => store.dispatch({ type : 'NEW_ENEMIE' }), config.game.attackClock);
    } else if (e.code === "KeyE"){
        clearInterval(clockTimer);
        clearInterval(clockAttack);
        store.dispatch({type:'DEBUG'});
    }
});

document.addEventListener('game-over', () =>{
    clearInterval(clockTimer);
    clearInterval(clockAttack);
    alert('hai perso');
})

const App = () =>(
    <Provider store={store}>
        <div>
            <h1>press S for start !!!</h1>
            <Container size={config.containerSize} style={config.containerStyle} />
        </div>
    </Provider>
);

ReactDOM.render(
    <App/>
    ,
    document.getElementById('root')
);

