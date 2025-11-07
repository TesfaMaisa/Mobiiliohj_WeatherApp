import { StyleSheet, Text, View } from 'react-native';
export default function Results({route}) {
  const { weather, city, country} = route.params;
  console.log(weather.temperature["@_value"]);
  return (
    <View>
       <View style={{ marginTop: 20 }}>
          <Text>City: {city}</Text>
          <Text>Country: {country}</Text>
          <Text>
             Temperature: {weather.temperature?.value ?? "N/A"}°C
          </Text>
          <Text>Humidity: {weather.humidity["@_value"]} %</Text>
          <Text>Wind: {weather.wind.speed["@_value"]} m/s</Text>
          <Text>Condition: {weather.weather["@_value"]}</Text>
          </View>
    </View>
  );
}