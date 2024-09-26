import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { NativeBaseProvider, StatusBar } from "native-base";
import Login from "@/pages/Login";
import { NAVIGATOR_SCREEN } from "@/utils/enum";
import Teacher from "@/app/Teacher";
import { Provider } from "react-redux";
import { store } from "@/store";
import StudentInClass from "@/pages/StudentInClass";
import HistoryTeacherDate from "@/pages/HistoryTeacherDate";
import Student from "@/app/Student";

const Stack = createNativeStackNavigator();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" />
      <NativeBaseProvider>
        <NavigationContainer independent>
          <Stack.Navigator>
            <Stack.Screen
              name={NAVIGATOR_SCREEN.LOGIN}
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={NAVIGATOR_SCREEN.TEACHER}
              component={Teacher}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={NAVIGATOR_SCREEN.STUDENT}
              component={Student}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={NAVIGATOR_SCREEN.STUDENT_IN_CLASS}
              component={StudentInClass}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={NAVIGATOR_SCREEN.HISTORY_TEACHER_DATE}
              component={HistoryTeacherDate}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
}
