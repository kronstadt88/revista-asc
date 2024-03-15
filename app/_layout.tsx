import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme} from 'react-native';
import { SessionProvider } from '../services/ctx';

import { confirmSignUp, ConfirmSignUpInput, signIn, type SignInInput } from 'aws-amplify/auth';
import { handleConfirmSignUp, type SignUpInput } from 'aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react-native';

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

async function handleSignUpConfirmation({
  username,
  confirmationCode
}: ConfirmSignUpInput) {
  return await confirmSignUp({
    username,
    confirmationCode
  });
  try {
    return await confirmSignUp({
      username,
      confirmationCode
    });
  } catch (error) {
    alert('error confirming sign up' + error);
  }
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <Authenticator.Provider>
      <Authenticator
      components={{
        SignUp: ({ fields, ...props }) => (
          <Authenticator.SignUp
            {...props}
            fields={[
              ...fields,
              {
                name: 'preferred_username',
                label: 'Preferred Username',
                type: 'default',
                placeholder: 'Enter your preferred username',
                //required: true
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
              options: { authFlowType: "USER_PASSWORD_AUTH" } 
              
            }),
            
          handleConfirmSignUp: async ({ username, confirmationCode }: ConfirmSignUpInput) =>
            handleSignUpConfirmation({username, confirmationCode})
        
        }}>

    
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        initialRouteName='/'
        
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          title: "Trading en la bolsaa",
          headerTintColor: '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
      </Stack>
      </ThemeProvider>
    </Authenticator>
    </Authenticator.Provider>
      
    
  );
}
