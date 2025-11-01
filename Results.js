import { StyleSheet, Text, View } from 'react-native';
export default function Results({route}) {
  const { weather } = route.params;
  return (
    <View>
       <View style={{ marginTop: 20 }}>
          <Text>City: {weather.city["@_name"]}</Text>
          <Text>Country: {weather.city.country}</Text>
          <Text>
            Temperature: {weather.temperature["@_value"]}°C
          </Text>
          <Text>Humidity: {weather.humidity["@_value"]} %</Text>
          <Text>Wind: {weather.wind.speed["@_value"]} m/s</Text>
          <Text>Condition: {weather.weather["@_value"]}</Text>
          </View>
    </View>
  );
}