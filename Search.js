import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import * as Haptics from "expo-haptics";
import * as SQLite from "expo-sqlite";

const API_KEY = "509bdebf1443c150e91bf04c163c2d13";

export default function Search({ navigation, route }) {
  const { db } = route.params;
  const [list, setList] = useState([]);
  const [weather, setWeather] = useState("");
  const [city, setCity] = useState("");
  const [citylist, setCityList] = useState([]);
  const [theCountry, setTheCountry] = useState("Afghanistan");
  const [countrylist, setCountryList] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [type, setType] = useState(false)

  function fetchCountries() {
    setLoadingCountries(true);
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.data.map((country) => country.country);
        setCountryList(countries);
        setLoadingCountries(false);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  }

  useEffect(() => {
    fetchCountries();
  }, []);

  function fetchCities() {
    setLoadingCities(true);
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then((response) => response.json())
      .then((data) => {
        // Process and set cities if fetched from an API
        const Cities = data.data.filter((c) => c.country === theCountry);
        const allCities = Cities[0].cities;
        setCityList(allCities);
        setCity(allCities[0]);
        setLoadingCities(false);
        setType(true)
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  }

  function fetchWeather() {
    if (city.length > 0) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&mode=xml&appid=${API_KEY}&units=metric`
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
          navigation.navigate("Results", {
            weather: weatherData,
            city: city,
            country: theCountry,
            database: db,
          });
        })
        .catch((error) => {
          console.error("Error while fetching weather:", error);
        });
    } else {
      window.alert("Choose a city!");
    }
  }

  return (
    <View style={styles.container}>
      {loadingCountries && (
        <Text style={{ fontWeight: "bold" }}>Loading countries</Text>
      )}
      {loadingCities && (
        <Text style={{ fontWeight: "bold" }}>Loading cities</Text>
      )}
      <TextInput
        placeholder="Type the name of the Country"
        onChangeText={(theCountry) => setTheCountry(theCountry)}
      ></TextInput>
      <Picker
        selectedValue={theCountry}
        onValueChange={(value) => setTheCountry(value)}
        style={{ width: 200 }}
      >
        {countrylist.map((c) => (
          <Picker.Item label={c} value={c} />
        ))}
      </Picker>
      <Button
        mode="contained"
        onPress={() => {
          fetchCities(),
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
      >
        Select country
      </Button>
     {type && <TextInput
        placeholder="Type the name of the City"
        onChangeText={(city) => setCity(city)}
      ></TextInput>}

      <View style={{ flex: 1 }}>
        <Picker
          selectedValue={city}
          onValueChange={(value) => setCity(value)}
          style={{ width: 200 }}
        >
          {citylist.map((c) => (
            <Picker.Item label={c} value={c} />
          ))}
        </Picker>
        <Button
          mode="contained"
          onPress={() => {
            fetchWeather(),
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          Get weather
        </Button>
      </View>
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
