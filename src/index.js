import config from '../config/config';
import '../styles/index.scss';

import produce from "immer";

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Container from "./component/container";


const initialState = {
        score:0,
        item: {
            x: 300,
            y: 380
        }
};

function reducer (state = initialState, action){
    console.log(state.item.x);
    switch(action.type){
        case 'MOVE':
            let nextPosition = state.item.x + action.payload;
            if (nextPosition >= 0 && nextPosition < config.containerSize.width) {
                return produce(state, draftState => {
                    draftState.item.x = nextPosition;
                });
            }
        case 'SCORE':
            return produce(state, draftState => {
               draftState.score ++;
            });
    }
    return state;
}

const store = createStore(reducer);
store.dispatch({type: 'MOVE'});
store.dispatch({type: 'SCORE'});


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

