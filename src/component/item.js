import React from 'react';

class Item extends React.Component {
    render(){
        return(
            <div className='item' style={this.props.position.css}>
            </div>
        )
    };
}

export default Item;