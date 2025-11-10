import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, TextInput, FlatList, ActivityIndicator } from "react-native";
import { Button, Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import * as Haptics from 'expo-haptics';
import * as SQLite from "expo-sqlite";

const API_KEY = "509bdebf1443c150e91bf04c163c2d13";

export default function Search({ navigation }) {
  const [list,setList] = useState([])
  const [weather, setWeather] = useState("");
  const [city, setCity] = useState(""); 
  const [citylist, setCityList] = useState([]);
  const [theCountry, setTheCountry] = useState("Afghanistan"); 
  const [countrylist, setCountryList] = useState([]);
  const db = SQLite.openDatabaseSync("weatherdb");
  const [loadingCountries, setLoadingCountries] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const [deleteAll, setDeleteAll] = useState(false)


    const initialize = async () => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS weather (id INTEGER PRIMARY KEY NOT NULL, country TEXT, city TEXT, temperature INT, wind INT, condition TEXT);
      `);
      await updateList()
    } catch (error) {
      console.error("Could not open database", error);
    }
  };
  useEffect(() => {
    initialize();
  }, []);


  const updateList = async () => {
    try {
     const allData = await db.getAllAsync('SELECT * from weather');
      setList(allData)
      if(allData.length > 0){
        setDeleteAll(true)
      }else{
        setDeleteAll(false)
      }
    } catch (error) {
      console.error('Could not get items', error);
    }
  }

  const deleteItem = async (id) => {
    try{
      await db.runAsync('DELETE from weather WHERE id=?', id);
      await updateList()
    }catch(error){
      console.error('Could not delete item', error)
    }
  }

        const dropTable = async () => {
    try {
      await db.runAsync(` DROP TABLE weather;`);
     await initialize()
     setDeleteAll(false)
    } catch (error) {
      console.error("Could not open database", error);
    }
  };

    function fetchCountries() {
    setLoadingCountries(true)
    fetch('https://countriesnow.space/api/v0.1/countries') 
      .then(response => response.json())
      .then(data => {
        const countries = data.data.map(country => country.country);
        setCountryList(countries);
        setLoadingCountries(false)
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
      });
  }

    useEffect(() => {
    fetchCountries();
  }, []);

  function fetchCities() {
    setLoadingCities(true)
    fetch('https://countriesnow.space/api/v0.1/countries') 
      .then(response => response.json())
      .then(data => {
        // Process and set cities if fetched from an API
       const Cities = data.data.filter(c => c.country === theCountry);
       const allCities = Cities[0].cities;
        setCityList(allCities);
        setCity(allCities[0])
        setLoadingCities(false)
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
      });
  }
  

  function fetchWeather(){
    if(city.length > 0){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&mode=xml&appid=${API_KEY}&units=metric`)
    .then((response) => response.text())
    .then((xmlText) => {const parser = new XMLParser({ignoreAttributes: false, attributeNamePrefix: "@_",});
      const json = parser.parse(xmlText);
      const weatherData = json.current
      setWeather(weatherData)
      navigation.navigate("Results", {weather:weatherData,city:city,country:theCountry, database:db});
    }).catch((error) => {
      console.error("Error while fetching weather:", error);
    })
     }else{
      window.alert('Choose a city!')
     } }

  function cityInfo(city,country){
    navigation.navigate("info",{city:city,country:country})
  }

  return (
    <View style={styles.container}>
    {loadingCountries && <Text>Loading countries</Text>}
    {loadingCities && <Text>Loading cities</Text>}
      <Picker
        selectedValue={theCountry}
        onValueChange={(value) => setTheCountry(value)}
        style={{ width: 200 }}
      >
        {countrylist.map((c) => (
          <Picker.Item label={c} value={c} />
        ))}
      </Picker>
      <Button mode="contained" onPress={() => {fetchCities(), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}>Select country</Button>
      <Picker
        selectedValue={city}
        onValueChange={(value) => setCity(value)}
        style={{ width: 200}}
      >
        {citylist.map((c) => (
          <Picker.Item label={c} value={c} />
        ))}
      </Picker>
      <Button mode="contained" onPress={() => {fetchWeather(), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}>Get weather</Button>
      <View style={{flex:2, alignItems:'center', marginTop:20}}>
        <View style={{flexDirection:'row'}}>
        <Text style={{marginTop:10}}> Favorites</Text>
        {deleteAll && <Button style={{marginBottom:20}} icon="delete-forever"  onPress={() => {dropTable(), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}>Delete all</Button>}
        </View>
        <View>
        {list != undefined && list.length  > 0 ? (
          <FlatList
            data={list}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{flexDirection:'row'}}>
                <Text style={{marginTop:10,fontWeight:'bold'}}>{item.city.toUpperCase()}</Text>
                <View style={{flexDirection:'row',marginLeft:'10%', alignItems:'100%'}}>
                <Button icon="information-variant-box" onPress={() => {cityInfo(item.city,item.country), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)}}>Info</Button>
                <Button icon="delete-forever-outline" onPress={() => {deleteItem(item.id), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)}}>Delete</Button>
                </View>
              </View>
            )}
          />
        ) : (
          <Text>No favorites added</Text>
        )}
        </View>
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