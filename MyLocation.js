import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { XMLParser } from "fast-xml-parser";
import MapView, { Marker } from "react-native-maps";


export default function MyLocation({ route }) {
  const { lon, lat } = route.params;
  const API_KEY = "509bdebf1443c150e91bf04c163c2d13";
  const [weather, setWeather] = useState("");

  function fetchWeather() {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&mode=xml&appid=${API_KEY}&units=metric`
    )
      .then((response) => response.text())
      .then((xmlText) => {
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "@_",
        });
        const json = parser.parse(xmlText);
        const weatherData = json.current;
        setWeather(weatherData);
        console.log(weatherData.city.country);
      })
      .catch((error) => {
        console.error("Error while fetching weather:", error);
      });
  }

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <View>
    <Text>Country: {weather?.city?.country ?? "Loading"}</Text>
      <Text>City: {weather?.city?.["@_name"] ?? "Loading"}</Text>
      <Text>
        Temperature: {weather?.temperature?.["@_value"] ?? "Loading"}°C
      </Text>
      <Text>Wind: {weather?.wind?.speed?.["@_value"] ?? "Loading"} m/s</Text>
      <Text>Condition: {weather?.weather?.["@_value"] ?? "Loading"}</Text>
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
        title={weather?.city?.["@_name"]}
      />
    </MapView>
    </View>
  );
}
