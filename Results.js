import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import * as SQLite from "expo-sqlite";
import { useState, useEffect } from "react";

export default function Results({ route,navigation }) {
  const { weather, city, country, database } = route.params;
  const [list, setList] = useState([]);
    console.log(city)

  const saveData = async () => {
    if(weather?.temperature["@_value"] != undefined){
  try {
    await database.runAsync('INSERT INTO weather (country, city, temperature, wind, condition) VALUES (?, ?, ?,?,? )', country, city, weather.temperature["@_value"], weather.wind.speed["@_value"], weather.weather["@_value"]);
    navigation.navigate("Search")
  } catch (error) {
    console.error('Could not add item', error);
  }
}else{
  window.alert('Weather data not found')
}};

function map(){
  navigation.navigate("Map",{city:city})
}


  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 20 }}>
        <Text>Country: {country}</Text>
        <Text>City: {city}</Text>
        <Text>Temperature: {weather?.temperature?.["@_value"] ? weather.temperature["@_value"] + '°C' : 'Not found'}</Text>
        <Text>Wind: {weather?.wind.speed["@_value"] ? weather.wind.speed["@_value"] + ' m/s'  : 'Not found'}</Text>
        <Text>Condition: {weather?.weather["@_value"] ? weather?.weather["@_value"] : 'Not found' }</Text>
        <Button style={{width:'100%',marginTop:20}} icon="star" mode="contained" onPress={saveData}>Add to favorites</Button>
        <Button style={{width:'100%',marginTop:20}} icon="map-marker" mode="contained" onPress={map}>Show on map</Button>
      </View>
    </View>
  );
}
