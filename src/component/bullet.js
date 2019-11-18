import React from 'react';

class Bullet extends React.Component {
    render(){
        return(
            <div className={'bullet'} style={{left : `${this.props.x}px`, top: `${this.props.y}px`}}/>
        )
    };
}

export default Bullet;