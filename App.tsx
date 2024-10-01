import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack"; // Import Stack
import Ionicons from "react-native-vector-icons/Ionicons";

import Home from "./src/screens/home";
import Pelanggan from "./src/screens/pelanggan/pelanggan";
import AddPelanggan from "./src/screens/pelanggan/addPelanggan";
import EditPelanggan from "./src/screens/pelanggan/editPelanggan";
import Barang from "./src/screens/barang/barang";
import AddBarang from "./src/screens/barang/addBarang"; // Import AddBarang screen
import EditBarang from "./src/screens/barang/editBarang";
import Penjualan from "./src/screens/penjualan/penjualan";

import { View, Text, TouchableOpacity, Button, Image } from "react-native";
import { styled } from "nativewind";
import { AddPenjualan } from "./src/screens/penjualan/addPenjualan";
import EditPenjualan from "./src/screens/penjualan/editPenjualan";

export const StyledTouchableOpacity = styled(TouchableOpacity);
export const StyledText = styled(Text);
export const StyledView = styled(View);
export const StyledButton = styled(Button);
export const StyledImage = styled(Image);
// Buat Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>(); // Create a Stack Navigator

// Buat Stack Navigator untuk Barang dan AddBarang

type RootStackParamList = {
  Barang: undefined;
  AddBarang: undefined;
  EditBarang: { id: number };
  Pelanggan: undefined;
  AddPelanggan: undefined;
  EditPelanggan: { id: number };
  Penjualan: undefined;
  AddPenjualan: undefined;
  EditPenjualan: { id: number };
};

function BarangStack() {
  return (
    <Stack.Navigator initialRouteName="Barang">
      {/* Pastikan tidak ada elemen lain di sini selain Screen */}
      <Stack.Screen
        name="Barang"
        component={Barang}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddBarang"
        component={AddBarang}
        options={{ title: "Add Barang", headerShown: false }}
      />
      {/* Screen untuk mengedit Barang */}
      <Stack.Screen
        name="EditBarang"
        component={EditBarang}
        options={{ title: "Edit Barang", headerShown: false }}
      />
    </Stack.Navigator>
  );
}
function PelangganStack() {
  return (
    <Stack.Navigator initialRouteName="Pelanggan">
      {/* Pastikan tidak ada elemen lain di sini selain Screen */}
      <Stack.Screen
        name="Pelanggan"
        component={Pelanggan}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPelanggan"
        component={AddPelanggan}
        options={{ title: "Add Pelanggan", headerShown: false }}
      />
      {/* Screen untuk mengedit Pelanggan */}
      <Stack.Screen
        name="EditPelanggan"
        component={EditPelanggan}
        options={{ title: "Edit Pelanggan", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function PenjualanStack() {
  return (
    <Stack.Navigator initialRouteName="Penjualan">
      {/* Pastikan tidak ada elemen lain di sini selain Screen */}
      <Stack.Screen
        name="Penjualan"
        component={Penjualan}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPenjualan"
        component={AddPenjualan}
        options={{ title: "Add Penjualan", headerShown: false }}
      />
      {/* Screen untuk mengedit Penjualan */}
      <Stack.Screen
        name="EditPenjualan"
        component={EditPenjualan}
        options={{ title: "Edit Penjualan", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "";
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Barang") {
              iconName = focused ? "cube" : "cube-outline";
            } else if (route.name === "Penjualan") {
              iconName = focused ? "cart" : "cart-outline";
            } else if (route.name === "Pelanggan") {
              iconName = focused ? "people" : "people-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        {/* Hanya Tab.Screen yang diperbolehkan di sini */}
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Pelanggan" component={PelangganStack} />
        <Tab.Screen name="Barang" component={BarangStack} />
        <Tab.Screen name="Penjualan" component={PenjualanStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
