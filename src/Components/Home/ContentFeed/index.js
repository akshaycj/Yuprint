import React, { Component } from "react";
import { Consumer } from "../../../Context/DataContext";
import { db } from "./../../../Utils/config";
import Card from './Card'
import './index.css'

export default props => (
  <Consumer>{({ user }) => <ContentCreator {...props} user={user} />}</Consumer>
);

class ContentCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedData:[]
    };
  }
  componentDidMount(){
    db.ref('content')
    .child('users')
    .child('Notes')
    .on("value",(snapshot)=>{
      let feedData=[]
      snapshot.forEach(item=>{
        var data={
          key:item.key,
          description: item.val().description,
          tags: item.val().tags,
          title:item.val().title ,
          type:item.val().type ,
          uid:item.val().uid ,
          url: item.val().url,
          user:item.val().user
        }
        feedData.push(data)
      });
      this.setState({feedData})
      console.log(feedData);
    })
  }

  render() {
    // const { fileList, isFile, loading } = this.state;
    return (
      <div className="content-creator-main" >
        {
          this.state.feedData.map((item,index)=>{
          return  <Card key={index} item={item} index={index} />
          })
        }

      </div>
    );
  }
}
