import React from 'react';
import './Header.css';
import logo from './logo.svg';


function Header(){
    return(
        <>
           <div className='header'>
             <img className="App-logo" src={logo}  alt=' ' height={"32px"}></img>
           </div>
        </>
    );
}

export default  Header;