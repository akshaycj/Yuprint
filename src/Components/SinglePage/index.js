import React from "react";
import { Consumer } from "../../Context/DataContext";
import "./index.css";
import { db } from "../../Utils/config";
import { Spin, Icon, Button } from "antd";
import { Redirect } from "react-router-dom";

export default props => (
  <Consumer>
    {({ user, setUser }) => (
      <SinglePage {...props} user={user} setUser={setUser} />
    )}
  </Consumer>
);

class SinglePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      redirect: false
    };
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      db.ref("content")
        .child("users")
        .child("Notes")
        .child(this.props.match.params.id)
        .on("value", item => {
          let data = item.val();
          data.key = item.key;
          console.log(data);
          this.setState({ data });
        });
    }
  }

  goBack = () => {
    this.setState({ redirect: true });
  };

  render() {
    return this.state.data ? (
      <div className="main-container">
        <div className="navbar">
          <Icon onClick={this.goBack} type="arrow-left" />
        </div>
        <div className="contentMainContainer">
          <h2>{this.state.data.title}</h2>
          <h5>
            Uploaded by <span>{this.state.data.user}</span>
          </h5>
          <div className="tagsContainer">
            {this.state.data.tags.map((tag, index) => {
              return <code key={index}>{"#" + tag}&nbsp;</code>;
            })}
          </div>
          <p>{this.state.data.description}</p>
          <div className="buttonsContainer">
            <Button className="upload-button upload-button-border">View</Button>
            <Button className="upload-button upload-button-back">Print</Button>
            <Button className="upload-button upload-button-border">
              Share
            </Button>
          </div>
        </div>
        {this.state.redirect ? <Redirect to="/home" /> : null}
      </div>
    ) : (
      <div className="main-container">
        <div className="spinnerContainer">
          <Spin size="large" />
        </div>
      </div>
    );
  }
}