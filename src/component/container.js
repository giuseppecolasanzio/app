import React from 'react';
import Item from "./item";


class Container extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: null,
            item : {
                x: props.size / 2,
                css: {left : props.size / 2+'px'}
            }
        };

        document.addEventListener('keydown', (e) => {
            console.log(e.code);
            if (e.code === "ArrowRight")        this.move(10)
            else if (e.code === "ArrowLeft") this.move(-10)
        });

    }

    move(delta){
        let newState = {};
        let x = this.state.item.x;
        x += delta;
        newState.x = x;
        newState.css = {left : x + 'px'};
        this.setState({item : newState});
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