import React from 'react';
import Item from "./item";
import produce from "immer";

class Container extends React.Component {

    constructor(props) {
        super(props);
        let x = props.size.width / 2;
        let y = props.size.height - 20;
        this.state = {
            value: null,
            bullets: [],
            item : {
                x: x,
                y: y
            }
        };

        this.clockTimer = setInterval(() => this.clock(), 20);

        document.addEventListener('keydown', (e) => {
            if (e.code === "ArrowRight") this.move(10)
            else if (e.code === "ArrowLeft") this.move(-10)
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === "Space") this.shot();
        });

    }

    componentWillUnmount(){
        clearInterval(this.clockTimer);
    }

    shot(){

        let startX = this.state.item.x;
        let startY = this.state.item.y;

        let newBullets = produce(this.state.bullets, draftBullets =>{
            draftBullets.push({x:startX, y:startY});
        });

        this.setState({bullets: newBullets});

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
        let newBullets = produce(this.state.bullets.filter(b => b.y > 0), draftBullets => {
                draftBullets.map(b => b.y -= 5);
            });

        this.setState({ bullets: newBullets });

    }

    render(){
        return(
            <div className='container' style={this.props.style}>

                {this.state.bullets.map(
                    (bullet) =>
                        <div key={`${bullet.x}x${bullet.y}`} className={'bullet'} style={{left : `${bullet.x}px`, top: `${bullet.y}px`}}>0</div>
                )}

                <Item position={this.state.item}/>
            </div>
        )
    };
}

export default Container;