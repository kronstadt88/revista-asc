import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useColorScheme} from 'react-native';
import {  signIn, signOut, type SignInInput } from 'aws-amplify/auth';

import {
  Authenticator,

} from "@aws-amplify/ui-react-native";

import { Button, Menu,  PaperProvider } from 'react-native-paper';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
    <PaperProvider>
    <Authenticator.Provider>
      <Authenticator
      components={{
        SignUp: ({ fields, ...props }) => (
          
          <Authenticator.SignUp 
            {...props}
            fields={[
              ...fields,
              {
                name: 'given_name',
                label: 'Enter your name',
                type: 'default',
                placeholder: 'Enter your preferred username',
                //required: true
              },
              {
                name: 'family_name',
                label: 'Enter your lastname',
                type: 'default',
                placeholder: 'Enter your lastname',
                
                //required: true
              },
              {
                name: 'phone_number',
                label: 'Phone Number',
                type: 'phone',
                placeholder: 'Enter your phone number',
                //required: true
              },
              {
                name: 'address',
                label: 'Address',
                type: 'default',
                placeholder: 'Enter your address',
                //required: true
              },
              {
                name: 'birthdate',
                label: 'Birthdate',
                type: 'default',
                placeholder: 'Enter your birthdate',
                //required: true
              },
              
              {
                name: 'zoneinfo',
                label: 'Zone info',
                type: 'default',
                placeholder: 'Enter your zone',
                //required: true
              },
              
            ]}
          />
          
        )
      }}
      
        services={{
          handleSignIn: ({ username, password, options }: SignInInput) =>
            signIn({
              username: username,
              password: password,
              options: { authFlowType: "USER_PASSWORD_AUTH" } 
              
            }),
            
        
        }}>

    
    <ThemeProvider value={DefaultTheme}>
      <Stack
        initialRouteName='/'
        
        screenOptions={{
          headerStyle: {
            backgroundColor: 'black',
          },
          title: "Trading en la bolsa",
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          
        }}
      >
        
      </Stack>
      </ThemeProvider>
    </Authenticator>
    </Authenticator.Provider>
    </PaperProvider>
      
    
  );
}
