import { StatusBar } from "expo-status-bar";
import * as SQLite from "expo-sqlite";
import { View, FlatList, ActivityIndicator } from "react-native";
import { Button, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';


export default function Homepage({navigation}) {
  const [list, setList] = useState([]);
  const [deleteAll, setDeleteAll] = useState(false);
  const [location, setLocation] = useState(null);

  const db = SQLite.openDatabaseSync("weatherdb");

  const initialize = async () => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS weather (id INTEGER PRIMARY KEY NOT NULL, country TEXT, city TEXT, temperature INT, wind INT, condition TEXT);
      `);
      await updateList();
    } catch (error) {
      console.error("Could not open database", error);
    }
  };
  
  useEffect(() => {
    initialize();
  }, []);

  const updateList = async () => {
    try {
      const allData = await db.getAllAsync("SELECT * from weather");
      setList(allData);
      if (allData.length > 1) {
        setDeleteAll(true);
      } else {
        setDeleteAll(false);
      }
    } catch (error) {
      console.error("Could not get items", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await db.runAsync("DELETE from weather WHERE id=?", id);
      await updateList();
    } catch (error) {
      console.error("Could not delete item", error);
    }
  };

  const dropTable = async () => {
    try {
      await db.runAsync(` DROP TABLE weather;`);
      await initialize();
      setDeleteAll(false);
    } catch (error) {
      console.error("Could not open database", error);
    }
  };

    function cityInfo(city,country){
    navigation.navigate("info",{city:city,country:country})
  }

const myLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('No permission to get location')
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    navigation.navigate("Current location",{lon:location.coords.longitude,lat:location.coords.latitude})
    console.log(location.coords.latitude + " " + location.coords.longitude)
  }

  return(
    <View style={{marginTop:50,flex:1}}>
        <Button style={{width:300,marginLeft:40}} mode="contained-tonal" onPress={() => {navigation.navigate("Search", {db:db}),Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}><Text style={{fontFamily:"Futura"}}>Go search for weather</Text></Button>
        <Button style={{marginTop:50}} icon="target-account" onPress={() => {myLocation(),Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)}}>Current location</Button>
    <View style={{alignItems:'center',marginTop:100}}>
          <View style={{flexDirection:'row'}}>
          <Text style={{marginTop:10,fontFamily:"Futura",textDecorationLine:"underline"}}>Favorites</Text>
          {deleteAll && <Button style={{marginBottom:20}} icon="delete-forever"  onPress={() => {dropTable(), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}><Text style={{fontFamily:"Futura"}}>Delete all</Text></Button>}
          </View>
          {list != undefined && list.length  > 0 ? (
            <FlatList
              data={list}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{flexDirection:'row'}}>
                  <View style={{width:100}}>
                  <Text style={{marginTop:12,fontWeight:'bold',fontFamily:"Futura"}}>{item.city.toUpperCase()}</Text>
                  </View>
                  <View style={{flexDirection:'row',marginLeft:'10%'}}>
                  <Button icon="information-variant-box" onPress={() => {cityInfo(item.city,item.country), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)}}><Text style={{fontFamily:"Futura"}}>Info</Text></Button>
                  <Button icon="delete-forever-outline" onPress={() => {deleteItem(item.id), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)}}><Text style={{fontFamily:"Futura"}}>Delete</Text></Button>
                  </View>
                </View>
              )}
            />
          ) : (
            <Text style={{fontFamily:"Futura"}}>No favorites added</Text>
          )}
          
        </View>
        <StatusBar style="auto" />
      </View>
    );
}
