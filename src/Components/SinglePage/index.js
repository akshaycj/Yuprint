import React from 'react';
import { Consumer } from "../../Context/DataContext";
import "./index.css";
import {  db } from "../../Utils/config";

export default props => (
  <Consumer>
    {({ user, setUser }) => <SinglePage {...props} user={user} setUser={setUser} />}
  </Consumer>
);

class SinglePage extends React.Component {

  componentDidMount(){
    db.ref('content')
    .child('users')
    .child('Notes')
    .child('-LcRqpsRQo3_uDd_h-d6')
    .on("value",(item)=>{
    let data=item.val()
    data.key=item.key
    this.setState({data})
    console.log(data);
    })
  }
  render() {
    return (
      <div className="">
        SinglePage
      </div>
    );
  }
}
