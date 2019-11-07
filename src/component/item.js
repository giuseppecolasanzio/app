import React from 'react';

class Item extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            x: props.size / 2,
            css: {left : props.size / 2+'px'},
        };

        document.addEventListener('keyup', (e) => {
            if (e.code === "ArrowRight")        this.move(10)
            else if (e.code === "ArrowLeft") this.move(-10)
        });

    };

     move(delta){
        let newState = {};
        let x = this.state.x;
        x += delta;
        newState.x = x;
        newState.css = {left : x + 'px'};
        this.setState(newState);
    };

    render(){
        return(
            <div className='item' style={this.state.css}>
            </div>
        )
    };
}

export default Item;