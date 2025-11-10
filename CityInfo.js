import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, FlatList } from "react-native";
import { Button } from "react-native-paper";
import { XMLParser } from "fast-xml-parser";
import * as Haptics from 'expo-haptics';


export default function CityInfo({ route, navigation }) {
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

  function map(){
  navigation.navigate("Map",{city:city})
}

  return (
    <View>
    <Text>Country: {country}</Text>
    <Text>City: {city}</Text>
    <Text>Temperature: {weather?.temperature?.["@_value"] ?? 'Loading'}°C</Text>
    <Text>Wind: {weather?.wind?.speed?.["@_value"] ?? 'Loading'} m/s</Text>
    <Text>Condition: {weather?.weather?.["@_value"] ?? 'Loading'}</Text>
    <Button style={{width:'100%',marginTop:20}} icon="map-marker" mode="contained" onPress={() => {map(),Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}>Show on map</Button>
    </View>
  );
}
