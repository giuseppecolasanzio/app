import React from 'react';
import Item from "./item";


class Container extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    render(){
        return(
            <div className='container' style={this.props.style}>
                <Item size={this.props.size}/>
            </div>
        )
    };
}

export default Container;