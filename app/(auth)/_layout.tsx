import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { Tabs } from "expo-router";

export { ErrorBoundary } from "expo-router";
import Products from "./products";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "/",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  

  return (

      <ThemeProvider value={DefaultTheme}>
        <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
          <Tabs.Screen
            name="products"
            options={{
              title: "Artículos",
              tabBarIcon: () => (
                <FontAwesome name="file-text-o" size={24} color="black" />
              ),
            }}
          />
          <Tabs.Screen
            name="library"
            options={{
              title: "Librería",
              tabBarIcon: () => (
                <FontAwesome name="book" size={24} color="black" />
              ),
            }}
          />
          <Tabs.Screen
            name="checkout"
            options={{
              title: "Subscripciones",
              tabBarIcon: () => (
                <FontAwesome name="shopping-basket" size={24} color="black" />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Perfil",
              tabBarIcon: () => (
                <FontAwesome name="user" size={24} color="black" />
              ),
            }}
          />
          <Tabs.Screen
            name="article/[id]"
            options={{
              title: "Artículos",
              href: null,
            }}
          />
        </Tabs>
      </ThemeProvider>
    
  );
}
