import ClassTeacher from "@/pages/ClassTeacher";
import HistoryTeacher from "@/pages/HistoryTeacher";
import Profile from "@/pages/Profile";
import { NAVIGATOR_SCREEN } from "@/utils/enum";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

const Teacher = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={NAVIGATOR_SCREEN.CLASS_TEACHER}
        component={ClassTeacher}
        options={{
          headerShown: false,
          tabBarLabel: "Lớp học",
          tabBarLabelStyle: { width: "100%" },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={NAVIGATOR_SCREEN.HISTORY_TEACHER}
        component={HistoryTeacher}
        options={{
          headerShown: false,
          tabBarLabel: "Lịch sử",
          tabBarLabelStyle: { width: "100%" },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="application"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name={NAVIGATOR_SCREEN.PROFILE}
        component={Profile}
        options={{
          headerShown: false,
          tabBarLabel: "Tài khoản",
          tabBarLabelStyle: { width: "100%" },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Teacher;
