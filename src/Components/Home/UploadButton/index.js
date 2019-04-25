import React from "react";
import PropTypes from "prop-types";
import TweenOne from "rc-tween-one";
import { Icon } from "antd";
import "./index.less";

const { TweenOneGroup } = TweenOne;

// const featuresCN = [
//   {
//     title: "Upload to print",
//     content: "You can upload multiple files at the same time",
//     src: "https://gw.alipayobjects.com/zos/rmsportal/VriUmzNjDnjoFoFFZvuh.svg",
//     color: "#13C2C2",
//     shadowColor: "rgba(19,194,194,.12)"
//   }
// ];

const pointPos = [
  { x: -30, y: -10 },
  { x: 20, y: -20 },
  { x: -65, y: 15 },
  { x: -45, y: 80 },
  { x: 35, y: 5 },
  { x: 50, y: 50, opacity: 0.2 }
];

export default class UploadButton extends React.PureComponent {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      hoverNum: 0,
      featuresCN: []
    };
  }
  componentDidMount() {
    var data = this.props.data;
    if (data) {
      this.setState({ featuresCN: data });
    }
  }
  onMouseOver = i => {
    this.setState({
      hoverNum: i
    });
  };
  onMouseOut = () => {
    this.setState({
      hoverNum: null
    });
  };
  getEnter = e => {
    const i = e.index;
    const r = Math.random() * 2 - 1;
    const y = Math.random() * 10 + 5;
    const delay = Math.round(Math.random() * (i * 50));
    return [
      {
        delay,
        opacity: 0.4,
        ...pointPos[e.index],
        ease: "easeOutBack",
        duration: 300
      },
      {
        y: r > 0 ? `+=${y}` : `-=${y}`,
        duration: Math.random() * 1000 + 2000,
        yoyo: true,
        repeat: -1
      }
    ];
  };
  render() {
    const { hoverNum, featuresCN } = this.state;
    let children = [[], [], []];
    featuresCN.forEach((item, i) => {
      const isHover = hoverNum === i;
      const pointChild = [
        "point-0 left",
        "point-0 right",
        "point-ring",
        "point-1",
        "point-2",
        "point-3"
      ].map(className => (
        <TweenOne
          component="i"
          className={className}
          key={className}
          style={{
            background: item.color,
            borderColor: item.color
          }}
        />
      ));
      const child = (
        <div
          className="page1-box"
          onMouseEnter={() => {
            this.onMouseOver(i);
          }}
          onMouseLeave={this.onMouseOut}
        >
          <TweenOneGroup
            className="page1-point-wrapper"
            enter={this.getEnter}
            leave={{
              x: 0,
              y: 30,
              opacity: 0,
              duration: 300,
              ease: "easeInBack"
            }}
            resetStyleBool={false}
          >
            {(this.props.isMobile || isHover) && pointChild}
          </TweenOneGroup>
          <div
            className="page1-image"
            style={{
              boxShadow: `${isHover ? "0 12px 24px" : "0 6px 12px"} ${
                item.shadowColor
              }`
            }}
          >
            <Icon
              type={item.icon}
              style={{ fontSize: 26, color: item.color }}
            />
            {/* {  theme="twoTone"
              twoToneColor={item.color}} */}
          </div>
          <h3>{item.title}</h3>
          <p>{item.content}</p>
        </div>
      );
      children[Math.floor(i / 3)].push(child);
    });

    return <div className="page1-box-wrapper">{children}</div>;
  }
}
