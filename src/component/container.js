import React from 'react';
import Item from "./item";
import Bullet from "./bullet";

import produce from "immer";
import inside from "point-in-polygon";

class Container extends React.Component {

    constructor(props) {
        super(props);
        let x = props.size.width / 2;
        let y = props.size.height - 20;
        this.state = {
            value: null,
            bullets: [],
            enemies: [],
            item: {
                x: x,
                y: y
            },
            score: 0
        };

        this.keys = {};
        const keyListener = (e) => {
            this.keys[e.code] = e.type === 'keydown'
        };

        document.addEventListener('keydown', keyListener);
        document.addEventListener('keyup', keyListener);

        this.moveTimer = setInterval( () => {
            if (this.keys['ArrowRight']) this.move(10);
            if (this.keys['ArrowLeft']) this.move(-10);
            },
            50);

        this.shotTimer = setInterval(()=> {
            if (this.keys['Space']) this.shot();
        },100);

        document.addEventListener('keydown', (e) =>{
           if  (e.code === "KeyS") {
               this.clockTimer = setInterval(() => this.clock(), 20);
               this.attackTimer = setInterval(() => this.attack(), 2000);
           }
        });

    }

    componentDidMount() {
        this.enemyDimension = {width:30, height:3};
    }

    componentWillUnmount(){
        clearInterval(this.clockTimer);
        clearInterval(this.attackTimer);
        clearInterval(this.shotTimer);
        clearInterval(this.moveTimer);
    }

    shot(){

        let startX = this.state.item.x + 5;
        let startY = this.state.item.y;

        let newBullets = produce(this.state.bullets, draftBullets =>{
            draftBullets.push({x:startX, y:startY});
        });

        this.setState({bullets: newBullets});

    }

    attack(){
        let x = Math.floor(Math.random() * (this.props.size.width - this.enemyDimension.width));
        let y = 5;
        let newEnemies = produce(this.state.enemies, draftEnemies => {
            draftEnemies.push({x,y});
        });
        this.setState({enemies: newEnemies});
    }

    move(delta){
      let nextPosition = this.state.item.x + delta;
      if (nextPosition >= 0 && nextPosition < this.props.size.width) {

          let newItem = produce(this.state.item, draftItem => {
              draftItem.x = nextPosition;
          });
          this.setState({item: newItem});

      }
    };

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
            this.setState({score : this.state.score + stockedEnemies});
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
                <div className={'score'}>score: {this.state.score}</div>

                {this.state.enemies.map(
                    (enemy) =>
                        <div key={`${enemy.x}x${enemy.y}`} className={'enemy'} style={{transform : `translate3d(${enemy.x}px, ${enemy.y}px, 0)`, width:`${this.enemyDimension.width}px`, height:`${this.enemyDimension.height}px`}}/>
                )}

                {this.state.bullets.map(
                    (bullet) =>
                        <Bullet key={`${bullet.x}x${bullet.y}`}  x={bullet.x} y={bullet.y} />
                )}


                <Item position={this.state.item}/>
            </div>
        )
    };
}

export default Container;