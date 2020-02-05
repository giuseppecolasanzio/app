import config from '../config/config';
import '../styles/index.scss';

import produce from "immer";

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Container from "./component/container";
import inside from "point-in-polygon";


const initialState = {
        score:0,
        item: {
            x: 300,
            y: 380
        },
        bullets: [],
        enemies: []
};

const isEnemyStruck = function(enemy, bullet){
    return inside(
        [bullet.x, bullet.y],
        [[enemy.x, enemy.y - 30], [enemy.x + config.enemyDimension.width, enemy.y - 30], [enemy.x, enemy.y - config.enemyDimension.height], [enemy.x + config.enemyDimension.width, enemy.y - config.enemyDimension.height]]
    );
}

function reducer (state = initialState, action){
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
        case 'SHOT':
            return ( () => {
                let x = state.item.x + 5;
                let y = state.item.y;
                return produce(state, draftState => {
                    draftState.bullets.push({x, y});
                });
            })();
        case 'NEW_ENEMIE':
            let x = Math.floor(Math.random() * (config.containerSize.width - config.enemyDimension.width));
            let y = 5;
            let newEnemies = produce(state.enemies, draftEnemies => {
                draftEnemies.push({x,y});
            });
            return produce(state, draftState => {
                draftState.enemies = newEnemies;
            });
        case 'CLOCK':
           let movedBullets = produce(state.bullets, draftBullets => {
               draftBullets.map(b => b.y -= 5);
           });
           let movedEnemies = produce(state.enemies, draftEnemies => {
               draftEnemies.map(e => e.y += 1);
           }).filter(e => {
            let match = true;
            let i = movedBullets.length;
            while (i--){
                let b = movedBullets[i];
                if ( isEnemyStruck(e,b) ) {
                    //i = false;
                    match = false;
                    }
                }
                return match;
            });

           if ((movedEnemies.filter(e => e.y > (config.containerSize.height - 20))).length > 0){
               alert('hai perso')
               return state;
           }

           return produce(state, draftState => {
               draftState.bullets = movedBullets.filter(b => b.y > 0);
               draftState.enemies = movedEnemies;
               draftState.score += state.enemies.length - movedEnemies.length;
           }) ;
        case 'DEBUG':
            console.log(state);
            return state;
    }
    return state;
}

const store = createStore(reducer);
store.dispatch({type: 'MOVE'});

document.addEventListener('keydown', (e) =>{
    let clockTimer, clockAttack;
    if  (e.code === "KeyS") {
        clockTimer = setInterval(() => store.dispatch({type: 'CLOCK'}), 20);
        clockAttack = setInterval(() => store.dispatch({ type : 'NEW_ENEMIE' }), 2000);

    } else if (e.code === "KeyE"){
        clearInterval(clockTimer);
        clearInterval(clockAttack);

        store.dispatch({type:'DEBUG'});
    }
});




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

