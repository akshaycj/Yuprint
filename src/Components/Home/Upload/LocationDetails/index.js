import React, { Fragment } from "react";
import { Input } from "antd";
import MapBox from "./../../MapBox/MapBox";

export default ({
  address1,
  address2,
  inputChange,
  setGeoPosition,
  validateData,
  onNextPrev
}) => (
  <Fragment>
    <div className="map-content">
      <MapBox setGeoPosition={setGeoPosition} />
    </div>
    <div className="address-container">
      <h5 style={{ color: "red" }}>*Currently available only near CUSAT</h5>
      <Input
        type="text"
        placeholder="Door No. / Flat"
        name="address1"
        onChange={inputChange}
        value={address1}
      />
      <Input
        type="text"
        placeholder="Landmark, Locality"
        name="address2"
        onChange={inputChange}
        value={address2}
      />
      <div className="upload-button-group">
        <div
          className="upload-button upload-button-border"
          onClick={onNextPrev.bind(this, false)}
        >
          Prev
        </div>{" "}
        <div
          className="upload-button upload-button-back"
          onClick={validateData}
        >
          Done
        </div>
      </div>
    </div>
  </Fragment>
);
