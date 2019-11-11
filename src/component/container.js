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
            item : {
                x: x,
                y: y,
                css: {
                    left : `${x}px`,
                    top: `${y}px`
                }
            }
        };

        document.addEventListener('keydown', (e) => {
            console.log(e.code);
            if (e.code === "ArrowRight") this.move(10)
            else if (e.code === "ArrowLeft") this.move(-10)
        });

    }

    move(delta){

      let nextPosition = this.state.item.x + delta;
      if (nextPosition >= 0 && nextPosition < this.props.size.width) {

          let newItem = produce(this.state.item, draftItem => {
              draftItem.x = nextPosition;
              draftItem.css.left = `${nextPosition}px`;
          });
          this.setState({item: newItem});

      }
    };

    render(){
        return(
            <div className='container' style={this.props.style}>

                    <Item position={this.state.item}/>

            </div>
        )
    };
}

export default Container;