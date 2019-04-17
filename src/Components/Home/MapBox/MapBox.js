import React, { Component } from "react";

const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
mapboxgl.accessToken =
  "pk.eyJ1IjoicmFiaXJvc2hhbiIsImEiOiJjanVrNXg4aTcwbzFjNDNucTE3YThrY3QzIn0.SAB8o_a-l9FuLprNGARBAA";

class MapBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: { lng: 76.3282, lat: 10.0443 } // Default CUSAT
    };
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      maxBounds: new mapboxgl.LngLatBounds(
        [76.29055, 10.007523],
        [76.383933, 10.083249]
      ),
      center: [76.3282, 10.0443],
      zoom: 14
    });

    // Zoom Controls
    this.map.addControl(new mapboxgl.NavigationControl());

    // Marker
    let marker = new mapboxgl.Marker({
      draggable: true
    })
      .setLngLat([76.3282, 10.0443])
      .addTo(this.map);
    const onDragEnd = () => {
      let lngLat = marker.getLngLat();
      this.setState(
        {
          position: { lng: lngLat.lng, lat: lngLat.lat }
        },
        () => {
          this.props.setGeoPosition(this.state.position);
        }
      );
    };
    marker.on("dragend", onDragEnd);

    // Current Location
    let geolocate = new mapboxgl.GeolocateControl({
      fitBoundsOptions: new mapboxgl.LngLatBounds(
        [76.29055, 10.007523],
        [76.383933, 10.083249]
      )
    });
    this.map.addControl(geolocate);
    this.map.on("load", () => {
      geolocate.trigger();
    });
    geolocate.on("geolocate", data => {
      marker.setLngLat([data.coords.longitude, data.coords.latitude]);
      this.setState(
        {
          position: { lng: data.coords.longitude, lat: data.coords.latitude }
        },
        () => {
          this.props.setGeoPosition(this.state.position);
        }
      );
    });

    // On Click
    this.map.on("click", data => {
      marker.setLngLat([data.lngLat.lng, data.lngLat.lat]);
      this.setState(
        {
          position: { lng: data.lngLat.lng, lat: data.lngLat.lat }
        },
        () => {
          this.props.setGeoPosition(this.state.position);
        }
      );
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    const style = {
      position: "absolute",
      top: "4%",
      bottom: 0,
      width: "100%"
    };

    return <div style={style} ref={el => (this.mapContainer = el)} />;
  }
}

export default MapBox;
