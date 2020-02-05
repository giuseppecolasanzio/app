import React from 'react';
import {connect} from "react-redux";
import produce from "immer";

function mapStateToProps(state){
    return {
        position : state.item
    }
};

class Item extends React.Component {
    constructor(props) {
        super(props);

        this.keys = {};
        const keyListener = (e) => {
            this.keys[e.code] = e.type === 'keydown'
        };

        document.addEventListener('keydown', keyListener);
        document.addEventListener('keyup', keyListener);

        this.moveTimer = setInterval(() => {
                if (this.keys['ArrowRight']) this.props.dispatch({type:'MOVE', payload: 10});
                if (this.keys['ArrowLeft']) this.props.dispatch({type:'MOVE', payload: -10});
            },
            50);

        this.shotTimer = setInterval(() => {
            if (this.keys['Space']) this.props.dispatch({type:'SHOT'});
        }, 100);

    }

    render(){
        return(
            <div className='item' style={{transform : `translate3d(${this.props.position.x}px , ${this.props.position.y - 3}px, 0)`}}>
            </div>
        )
    };
}

export default connect(mapStateToProps)(Item);