import { ScrollViewStyleReset } from 'expo-router/html';


import { Amplify, Auth } from 'aws-amplify';
import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
import { withAuthenticator } from '@aws-amplify/ui-react';


import awsconfig from '../src/aws-exports';
Amplify.configure(awsconfig);
Auth.configure(awsconfig);

type SignUpParameters = {
  username: string;
  password: string;
  email: string;
  phone_number: string;
};

export async function signUp({
  username,
  password,
  email,
  phone_number
}: SignUpParameters) {
  try {
    const { user } = await Auth.signUp({
      username,
      password,
      attributes: {
        email, // optional
        phone_number // optional - E.164 number convention
        // other custom attributes
      },
      autoSignIn: {
        // optional - enables auto sign in after user is confirmed
        enabled: true
      }
    });
    console.log(user);
  } catch (error) {
    console.log('error signing up:', error);
  }
}
//signUp({username:"Tati", password:"Thisisapassword123!!", email:"alberto.martin1535@gmail.com", phone_number: "+123121424"})
// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export function Root({ children }: { children: React.ReactNode }, { signOut, user }: WithAuthenticatorProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* 
          This viewport disables scaling which makes the mobile website act more like a native app.
          However this does reduce built-in accessibility. If you want to enable scaling, use this instead:
            <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        */}
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover"
        />
        {/* 
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native. 
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers in dark-mode. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>{children}</body>
    </html>
  );
}

export default Root;

const responsiveBackground = `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}`;
