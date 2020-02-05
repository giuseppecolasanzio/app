import React from 'react';
import {connect} from 'react-redux';
import Item from "./item";
import Bullet from "./bullet";

import produce from "immer";
import inside from "point-in-polygon";

function mapStateToProps(state){
    return {
        score : state.score,
        bullets : state.bullets,
        enemies : state.enemies
    }
};

class Container extends React.Component {

    constructor(props) {
        super(props);
        let x = props.size.width / 2;
        let y = props.size.height - 20;
        this.state = {
            value: null,
            //enemies: [],
            item: {
                x: x,
                y: y
            }
        };
/*
        document.addEventListener('keydown', (e) =>{
           if  (e.code === "KeyS") {
               this.clockTimer = setInterval(() => this.clock(), 20);
               this.attackTimer = setInterval(() => this.attack(), 2000);
           }
        });
*/
    }

    componentDidMount() {
        this.enemyDimension = {width:30, height:3};
    }

    componentWillUnmount(){
        clearInterval(this.clockTimer);
    }


    clock(){

        const newBullets = produce(this.state.bullets, draftBullets => {
                draftBullets.map(b => b.y -= 5);
            });
        this.setState({ bullets: newBullets.filter(b => b.y > 0) });

        const newEnemies = produce(this.state.enemies, draftEnemies => {
                draftEnemies.map(e => e.y += 1);
            });

        const enemiesNoStroked = produce(newEnemies, draftEnemies => (
            draftEnemies.filter(e => {
                let match = true;

                let i = this.state.bullets.length;
                while (i--){
                    let b = this.state.bullets[i];
                    if ( this.isEnemyStruck(e,b) ) {
                        this.setState({bullets : this.bulletRemover(i)});
                        i = false;
                        match = false;
                    }
                }

                return match;
            })
        ));


        const stockedEnemies = newEnemies.length - enemiesNoStroked.length;
        if(stockedEnemies > 0){
            this.props.dispatch({type:'SCORE'});
        }

        const enemies = enemiesNoStroked.filter(e => e.y < (this.props.size.height - 20));

        if (enemiesNoStroked.length - enemies.length > 0){
            clearInterval(this.clockTimer);
            clearInterval(this.attackTimer);
            alert('hai perso');
        }

        this.setState({enemies: enemies});
    }

    bulletRemover(bulletIndex){
         return produce(this.state.bullets, bullets => {
                bullets.splice(bulletIndex,1);
                return bullets;
            } );
    }

    isEnemyStruck(enemy, bullet){
        return inside(
            [bullet.x, bullet.y],
            [[enemy.x, enemy.y - 30], [enemy.x + this.enemyDimension.width, enemy.y - 30], [enemy.x, enemy.y - this.enemyDimension.height], [enemy.x + this.enemyDimension.width, enemy.y - this.enemyDimension.height]]
        );
    }

    render(){
        return(

            <div className='container' style={this.props.style}>
                <div className={'score'}>score: {this.props.score}</div>

                {this.props.enemies.map(
                    (enemy) =>
                        <div key={`${enemy.x}x${enemy.y}`} className={'enemy'} style={{transform : `translate3d(${enemy.x}px, ${enemy.y}px, 0)`, width:`${this.enemyDimension.width}px`, height:`${this.enemyDimension.height}px`}}/>
                )}

                {this.props.bullets.map(
                    (bullet) =>
                        <Bullet key={`${bullet.x}x${bullet.y}`}  x={bullet.x} y={bullet.y} />
                )}

                <Item />
            </div>
        )
    };
}

export default connect(mapStateToProps)(Container);