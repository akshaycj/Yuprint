import React, { Component, Fragment } from "react";
import { Input } from "antd";
import { TweenOneGroup } from "rc-tween-one";

const { TextArea } = Input;

export default ({
  title,
  description,
  handleDescriptionChange,
  handleTitleChange
}) => (
  <Fragment>
    <Input
      placeholder="Title"
      style={{ marginBottom: "5%" }}
      value={title}
      onChange={handleTitleChange}
    />
    <TextArea
      rows={4}
      style={{ marginBottom: 20 }}
      placeholder="Description"
      value={description}
      onChange={handleDescriptionChange}
    />
    {/* <div style={{ marginBottom: 16 }}>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: "from",
              duration: 100,
              onComplete: e => {
                e.target.style = "";
              }
            }}
            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
          </div> */}
  </Fragment>
);
