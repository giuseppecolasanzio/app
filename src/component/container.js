import React from 'react';
import {connect} from 'react-redux';
import Item from "./item";
import Bullet from "./bullet";
import config from "../../config/config";

function mapStateToProps(state){
    return {
        score : state.score,
        bullets : state.bullets,
        enemies : state.enemies
    }
}

class Container extends React.Component {

    render(){
        return(

            <div className='container' style={this.props.style}>
                <div className={'score'}>score: {this.props.score}</div>

                {this.props.enemies.map(
                    (enemy) =>
                        <div key={`${enemy.x}x${enemy.y}`} className={'enemy'} style={{transform : `translate3d(${enemy.x}px, ${enemy.y}px, 0)`, width:`${config.enemyDimension.width}px`, height:`${config.enemyDimension.height}px`}}/>
                )}

                {this.props.bullets.map(
                    (bullet) =>
                        <Bullet key={`${bullet.x}x${bullet.y}`}  x={bullet.x} y={bullet.y} />
                )}

                <Item />
            </div>
        )
    };
}

export default connect(mapStateToProps)(Container);