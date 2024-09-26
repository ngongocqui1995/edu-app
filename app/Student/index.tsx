import ClassStudent from "@/pages/ClassStudent";
import NotifyStudent from "@/pages/NotifyStudent";
import Profile from "@/pages/Profile";
import { NAVIGATOR_SCREEN } from "@/utils/enum";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

const Student = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={NAVIGATOR_SCREEN.CLASS_STUDENT}
        component={ClassStudent}
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
        name={NAVIGATOR_SCREEN.NOTIFY_STUDENT}
        component={NotifyStudent}
        options={{
          headerShown: false,
          tabBarLabel: "Thông báo",
          tabBarLabelStyle: { width: "100%" },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
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

export default Student;
