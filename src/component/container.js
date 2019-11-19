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
        const listener = (e) => {
            this.keys[e.code] = e.type == 'keydown'
        };

        document.addEventListener('keydown', listener);
        document.addEventListener('keyup', listener);

        this.moveAndShotTimer = setInterval( () => {
            if (this.keys['ArrowRight']) this.move(10);
            if (this.keys['ArrowLeft']) this.move(-10);
            if (this.keys['Space']) this.shot();},
            50);

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
        clearInterval(this.moveAndShotTimer);
    }

    shot(){

        let startX = this.state.item.x;
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

        const withoutStrockedEnemies = produce(newEnemies, draftEnemies => (
            draftEnemies.filter(e => {
                let match = true;
                this.state.bullets.some(b => {
                    if (inside(
                        [b.x, b.y],
                        [[e.x, e.y - 20], [e.x + this.enemyDimension.width, e.y - 20], [e.x, e.y - this.enemyDimension.height], [e.x + this.enemyDimension.width, e.y - this.enemyDimension.height]]
                    )
                    ) {
                        console.log(b);
                        match = false;
                    }
                });
                return match;
            })
        ));


        const stockedEnemies = newEnemies.length -withoutStrockedEnemies.length;
        if(stockedEnemies > 0){
            this.setState({score : this.state.score + stockedEnemies});
        }

        const enemies = withoutStrockedEnemies.filter(e => e.y < (this.props.size.height - 20));

        if (withoutStrockedEnemies.length - enemies.length > 0){
            clearInterval(this.clockTimer);
            clearInterval(this.attackTimer);
            alert('hai perso');
        }

        this.setState({enemies: enemies});
    }

    render(){
        return(

            <div className='container' style={this.props.style}>
                <div className={'score'}>{this.state.score}</div>

                {this.state.enemies.map(
                    (enemy) =>
                        <div key={`${enemy.x}x${enemy.y}`} className={'enemy'} style={{left : `${enemy.x}px`, top: `${enemy.y}px`, width:`${this.enemyDimension.width}px`, height:`${this.enemyDimension.height}px`}}/>
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