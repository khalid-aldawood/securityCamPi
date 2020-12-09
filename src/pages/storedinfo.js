import React, { Component } from 'react';
import axios from 'axios';
import "../all.css"
import { Checkbox } from 'semantic-ui-react'
const uri = require('../URI').URI;



export default class Storedinfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
        info:null,
        cleaninfo:[],
        alertToggle: false

    }
  }

componentDidMount() {
    axios.get(uri+'api/storedinfo').then(async(res)=>{ 
        
    this.setState({info:res.data}) 

}).catch(err=>console.log(err))


}

  render() {

    return (

<div>
    <div style={{display:"flex" ,justifyContent:"center"}}>
    Show "true" alert only &nbsp;
    <Checkbox toggle  onClick={()=> this.setState({alertToggle: !this.state.alertToggle})}/>
    </div>
    	<div style={{display:"flex" ,justifyContent:"center"}}>





        {this.state.info && !this.state.alertToggle &&
        <table class="styled-table">
      <tr key={"header"}>
        {Object.keys(this.state.info[0]).filter((key)=> key != "__v").map((key) => ( //
          <th>{key}</th> 
        ))}
      </tr>
      {this.state.info.map((item,key) => (
        <tr key={item.id}>
            {console.log(item)}
          {Object.values(item).filter((val,key)=> key != "5").map((val,key) => (
            <td>{val.toString()}</td>
          ))}
        </tr>
      ))}
    </table>
  }

{this.state.info && this.state.alertToggle &&
        <table class="styled-table">
      <tr key={"header"}>
        {Object.keys(this.state.info[0]).filter((key)=> key != "__v").map((key) => ( //
          <th>{key}</th> 
        ))}
      </tr>
      {this.state.info.filter((item)=> item.alert.toString() != "false").map((item,key) => (
        <tr key={item.id}>
            {console.log(item)}
          {Object.values(item).filter((val,key)=> key != "5").map((val,key) => (
            <td>{val.toString()}</td>
          ))}
        </tr>
      ))}
    </table>
  }

        </div>

        </div>
        
    );

	}
}