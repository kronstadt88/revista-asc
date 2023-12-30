import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { Amplify, Auth, API } from "aws-amplify";
import config from '../src/aws-exports';
Amplify.configure(config);



export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  async function getTodo() {
    
    const apiName = 'ascpi';
    const path = '/sign-up';
    const myInit = {
      headers: {}, // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        name: 'param' // OPTIONAL
      }
    };

    API.get(apiName, path, myInit)
      .then((response) => {
        // Add your code here
      })
      .catch((error) => {
        console.log(error.response);
      });
      }
  
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    getTodo()
    

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
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
