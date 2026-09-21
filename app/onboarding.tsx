import React from "react";
import { Text, View } from "react-native";

const Onboarding = () => {
  return (
    <View>
      <Text>onboarding</Text>
    </View>
  );
};

export default Onboarding;

/*

# Expo Router

File-Based Routing. Files automatically become routes in your app. 
                    Create a file and it becomes a route. Create a folder and it becomes a route group.
                    app/onboarding.tsx  --->  /onboarding

Route Groups. Organize screens without affecting the URLs. 
                  (auth)/_layout.tsx
                        /SignIn
                        /SignUp

Stack Navigator. Screens share a common layout. 
                 Layouts that ley multiple screens share the same navigation parent. 
                 Every screen in a group inherits its layout. 


Bottom Tabs. Main screens live inside tab navigation. 
            The dynamic routes, that let one file handle many detail pages. 
            [id].tsx

Expo Router Link. Navigation Links. Navigate between screens using the Link component.
                  <Link href="/onboarding">Go to Onboarding</Link>


We are building the navigation tree directly through folders and files. Expo Router. 

*/
