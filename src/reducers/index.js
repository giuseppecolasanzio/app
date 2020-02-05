import config from "../../config/config";
import produce from "immer";
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

const checkEnemieBulletsMatch = (enemy, bullets) => {
    let match = true;
    let i = bullets.length;
    while (i--){
        let b = bullets[i];
        if ( isEnemyStruck(enemy,b) ) {
            //i = false;
            match = false;
        }
    }
    return match;
}

const gameOver = () => {
    const event = document.createEvent('Event');
    event.initEvent('game-over', true, true);
    document.dispatchEvent(event);
}


export default function reducer (state = initialState, action){
    switch(action.type){
        case 'RE-START':
            return initialState;
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
            }).filter((e)=>{return checkEnemieBulletsMatch(e,movedBullets)});

            if ((movedEnemies.filter(e => e.y > (config.containerSize.height - 20))).length > 0){
                gameOver();
                return state;
            } else {
                return produce(state, draftState => {
                    draftState.bullets = movedBullets.filter(b => b.y > 0);
                    draftState.enemies = movedEnemies;
                    draftState.score += state.enemies.length - movedEnemies.length;
                }) ;
            }
        case 'DEBUG':
            console.log(state);
            return state;
    }
    return state;
}