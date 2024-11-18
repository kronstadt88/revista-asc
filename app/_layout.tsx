import { Amplify } from "aws-amplify";
import awsconfig from "../amplifyconfiguration.json";
Amplify.configure(awsconfig);

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { signIn, type SignInInput } from "aws-amplify/auth";
import { Authenticator } from "@aws-amplify/ui-react-native";

import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';


import { I18n } from "aws-amplify/utils";
import { translations } from "@aws-amplify/ui";
I18n.putVocabularies(translations);
I18n.setLanguage("es");

I18n.putVocabularies({
  es: {
    "Sign In": "Registrarse",
    "Sign Up": "Regístrate",
    "Enter your Username": "Introduce tu nombre de usuario",
    "Forgot Password?": "Olvidaste la contraseña?",
  },
});


export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "/",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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

const theme = {
  ...DefaultTheme,
  
};

function RootLayoutNav() {
  return (
    <PaperProvider theme={theme}>
    <Authenticator.Provider>
      <Authenticator
        components={{
          SignUp: ({ fields, ...props }) => (
            <Authenticator.SignUp
              {...props}
              fields={[
                ...fields,
                {
                  name: "given_name",
                  label: "Nombre",
                  type: "default",
                  placeholder: "Introduzca su nombre",
                  required: true,
                },
                {
                  name: "family_name",
                  label: "Apellidos",
                  type: "default",
                  placeholder: "Introduzca sus apellidos",
                  required: true,
                },
                {
                  name: "phone_number",
                  label: "Teléfono",
                  type: "phone",
                  placeholder: "Introduzca su teléfono con el prefijo de país",
                  required: true,
                },
                {
                  name: "address",
                  label: "Dirección",
                  type: "default",
                  placeholder: "Introduzca su calle, ciudad y código postal",
                  required: true,
                },
                {
                  name: "birthdate",
                  label: "Fecha de nacimiento",
                  type: "default",
                  placeholder: "Introduzca su fecha de nacimiento",
                  required: true,
                },

                {
                  name: "zoneinfo",
                  label: "País",
                  type: "default",
                  placeholder: "Introduzca su país",
                  required: true,
                },
              ]}
            />
          ),
        }}
        services={{
          handleSignIn: ({ username, password, options }: SignInInput) =>
            signIn({
              username: username,
              password: password,
              options: { authFlowType: "USER_PASSWORD_AUTH" },
            }),
        }}
      >
        <Stack
          initialRouteName="/"
          screenOptions={{
            headerStyle: {
              backgroundColor: "black",
            },
            title: "Trading en la bolsa",
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        ></Stack>
      </Authenticator>
    </Authenticator.Provider>
    </PaperProvider>
  );
}
