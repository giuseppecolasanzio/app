import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/index.scss';
//import './lib/keyListener.js';
import Container from "./component/container";

const containerStyle = {
    width: "600px",
    height: "50px"
};

const containerSize = 600;

const App = () =>(
    <div>
        <h1>Hello world!!!!!!!!!!!!!!!!!!!!!!!!!!</h1>
        <Container size={containerSize} style={containerStyle}/>
    </div>
);

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

