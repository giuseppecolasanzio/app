import React from 'react';

class Item extends React.Component {
    render(){
        return(
            <div className='item' style={{transform : `translate3d(${this.props.position.x}px , ${this.props.position.y - 3}px, 0)`}}>
            </div>
        )
    };
}

export default Item;