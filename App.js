import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { PaperProvider } from 'react-native-paper';

import Search from "./Search";
import Results from "./Results";
import Map from "./Map";
import CityInfo from "./CityInfo";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Results" component={Results} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="CityInfo" component={CityInfo} />
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
