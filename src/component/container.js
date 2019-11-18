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
            }
        };

        this.clockTimer = setInterval(() => this.clock(), 20);
        this.attackTimer = setInterval(() => this.attack(), 2000);

        document.addEventListener('keydown', (e) => {
            if (e.code === "ArrowRight") this.move(10)
            else if (e.code === "ArrowLeft") this.move(-10)
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === "Space") this.shot();
        });
/*
        var polygon = [[1, 1], [1, 2], [2, 2], [2, 1]];

        console.dir([
            inside([1.5, 1.5], polygon),
            inside([4.9, 1.2], polygon),
            inside([1.8, 1.1], polygon)
        ]);
*/
    }

    componentDidMount() {
        this.enemyDimension = {width:30, height:3};
    }

    componentWillUnmount(){
        clearInterval(this.clockTimer);
        clearInterval(this.attackTimer);
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

        const withoutFiredEnemy = produce(newEnemies, draftEnemies => (
            draftEnemies.filter(e => {
                let match = true;

                this.state.bullets.some(b => {
                    if (inside(
                        [b.x, b.y],
                        [[e.x, e.y - 20], [e.x + this.enemyDimension.width, e.y - 20], [e.x, e.y - this.enemyDimension.height], [e.x + this.enemyDimension.width, e.y - this.enemyDimension.height]]
                    )
                    ) {
                        match = false;
                    }
                });

                console.log(match);
                return match;
            })
        ));
        
        const enemies = withoutFiredEnemy.filter(e => e.y < (this.props.size.height - 20));

        if (withoutFiredEnemy.length - enemies.length > 0){
            clearInterval(this.clockTimer);
            clearInterval(this.attackTimer);
            alert('hai perso');
        }

        this.setState({enemies: enemies});
    }

    render(){
        return(
            <div className='container' style={this.props.style}>

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