import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'
import io from "socket.io-client";
const uri = require('../URI').URI;



export default class Livefeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: "",
      temp:"",
      socket: io(uri),
    }
  }

componentDidMount() {

    this.state.socket.on('connect',()=>{
      
      this.state.socket.on("livefeed", async(cb) => {
          this.setState({img:cb})
      });

      this.state.socket.on("livetemp", async(cb) => {
        this.setState({temp:cb})
    });

    })
    
    
}

  render() {

    return (

    	<div className="main">
        <br/>
        <div style={{display:"flex" ,justifyContent:"center"}}>
        <img src={`data:image/png;base64,${this.state.img}`}></img>
        </div>
        <br/>
        <h2  style={{display:"flex" ,justifyContent:"center"}}> temperature : {this.state.temp}c </h2>

        <br/>

       

        <h2 style={{display:"flex" ,justifyContent:"center"}}>object detection</h2>
        
        <div style={{display:"flex" ,justifyContent:"center", padding:"10px"}}>
        <Button onClick={()=>{this.state.socket.emit("detection","on")}}>on</Button>
        <Button onClick={()=>{this.state.socket.emit("detection","off")}}>off</Button>

        </div>

        </div>
        
    );

	}
}