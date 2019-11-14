import React from 'react';

class Item extends React.Component {
    render(){
        return(
            <div className='item' style={{left : `${this.props.position.x}px`, top: `${this.props.position.y}px`}}>
            </div>
        )
    };
}

export default Item;