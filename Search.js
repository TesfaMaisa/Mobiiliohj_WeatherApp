import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";

const API_KEY = "509bdebf1443c150e91bf04c163c2d13";

export default function Search({ navigation }) {
  const [weather, setWeather] = useState("");
  const [city, setCity] = useState(""); 
  const [citylist, setCityList] = useState([]);
  const [maa, setMaa] = useState("Afghanistan"); 
  const [countrylist, setCountryList] = useState([]);

  console.log(city);

    function fetchCountries() {
    fetch('https://countriesnow.space/api/v0.1/countries') 
      .then(response => response.json())
      .then(data => {
        const countries = data.data.map(country => country.country);
        setCountryList(countries);
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
      });
  }

    useEffect(() => {
    fetchCountries();
  }, []);

  function fetchCities() {
    fetch('https://countriesnow.space/api/v0.1/countries') 
      .then(response => response.json())
      .then(data => {
        // Process and set cities if fetched from an API
       const Cities = data.data.filter(c => c.country === maa);
       const allCities = Cities[0].cities;
        setCityList(allCities);
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
      });
  }
  

  function fetchWeather(){
    console.log("📍 City before fetch:", city);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&mode=xml&appid=${API_KEY}&units=metric`)
    .then((response) => response.text())
    .then((xmlText) => {const parser = new XMLParser({ignoreAttributes: false, attributeNamePrefix: "@_",});
      const json = parser.parse(xmlText);
      const weatherData = json.current
        console.log("🔍 Full parsed XML JSON:", JSON.stringify(json, null, 2));
      setWeather(weatherData)
      navigation.navigate("Results", {weather:weatherData,city:city,country:maa});
    }).catch((error) => {
      console.error("Error while fetching weather:", error);
    })
  }

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={maa}
        onValueChange={(value) => setMaa(value)}
        style={{ width: 200, marginBottom: 10 }}
      >
        {countrylist.map((c) => (
          <Picker.Item label={c} value={c} />
        ))}
      </Picker>
      <Button title="Select country" onPress={fetchCities} />
      <Picker
        selectedValue={city}
        onValueChange={(value) => setCity(value)}
        style={{ width: 200, marginBottom: 10 }}
      >
        {citylist.map((c) => (
          <Picker.Item label={c} value={c} />
        ))}
      </Picker>
      <Button title="Get Weather" onPress={fetchWeather} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});