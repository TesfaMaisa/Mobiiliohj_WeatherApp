import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";

export default function Map({ route }) {
  const { city } = route.params;
  const [lat, setLat] = useState(0);
  const [lon, setlon] = useState(0);

  function fetchCityLocation() {
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`
    )
      .then((response) => response.json())
      .then((data) => {
        setLat(parseFloat(data[0].lat));
        setlon(parseFloat(data[0].lon));
        console.log(data[0].lat);
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
      });
  }

  useEffect(() => {
    fetchCityLocation();
  }, []);

  return (
    <MapView
      style={{ width: "100%", height: "100%" }}
      region={{
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <Marker
        coordinate={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }}
        title={city}
      />
    </MapView>
  );
}
