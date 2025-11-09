import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, FlatList } from "react-native";
import { XMLParser } from "fast-xml-parser";

export default function CityInfo({ route }) {
  const { city, country } = route.params;
  const [weather, setWeather] = useState("");
  const API_KEY = "509bdebf1443c150e91bf04c163c2d13";

    function fetchWeather(){
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&mode=xml&appid=${API_KEY}&units=metric`)
      .then((response) => response.text())
      .then((xmlText) => {const parser = new XMLParser({ignoreAttributes: false, attributeNamePrefix: "@_",});
        const json = parser.parse(xmlText);
        const weatherData = json.current
        console.log(weatherData)
        setWeather(weatherData)
      }).catch((error) => {
        console.error("Error while fetching weather:", error);
      })
    }

  useEffect(() => {
    fetchWeather();
  }, []);


  return (
    <View>
    <Text>Country: {country}</Text>
    <Text>City: {city}</Text>
    <Text>Temperature: {weather?.temperature?.["@_value"] ?? 'Loading'} °C</Text>
    <Text>Wind: {weather?.wind?.speed?.["@_value"] ?? 'Loading'} m/s</Text>
    <Text>Condition: {weather?.weather?.["@_value"] ?? 'Loading'}</Text>  
    </View>
  );
}
