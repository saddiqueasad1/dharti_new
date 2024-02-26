// App.js

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { Platform, View } from "react-native";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/slices/user";
import {
  BikeScreen,
  CategoryScreen,
  ChatScreen,
  HomeScreen,
  ListData,
  MyListingScreen,
  ProfileScreen,
  SearchScreen,
} from "../../screens/app";
import { PreLogin } from "../../screens/auth";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";
import ScreenNames from "../routes";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { selectNewChat } from "../../redux/slices/config";
import AddIcon from "../../svgcomponents/plus";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
function TestStack() {
  return (
    <Stack.Navigator screenOptions={{ header: () => false }}>
      <Stack.Screen name={ScreenNames.HOME} component={HomeScreen} />
      <Stack.Screen name={ScreenNames.LISTDATA} component={ListData} />
      <Stack.Screen name={ScreenNames.CATEGORY} component={CategoryScreen} />
      <Stack.Screen name={ScreenNames.BIKECATEGORY} component={BikeScreen} />
      <Stack.Screen name={ScreenNames.SEARCH} component={SearchScreen} />
    </Stack.Navigator>
  );
}
const BottomNav = ({ navigation }) => {
  const islogin = useSelector(selectIsLoggedIn);
  const msg = useSelector(selectNewChat);
  return (
    // <DrawerSceneWrapper>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "StackHome") {
            iconName = focused ? "home-sharp" : "home-outline";
          } else if (route.name === "myChat") {
            iconName = focused
              ? "chatbubble-ellipses-sharp"
              : "chatbubble-ellipses-outline";
          } else if (route.name === "tit") {
            return (
              <View
                style={{
                  position: "absolute",
                  ...Platform.select({
                    ios: {
                      bottom: height(0.6),
                      // Additional iOS-specific styles
                    },
                    android: {
                      bottom: height(2.8),
                      // Additional Android-specific styles
                    },
                  }),
                }}
              >
                <AddIcon
                  tintColor="#2d3436"
                  height={height(7)}
                  width={height(7)}
                />
              </View>
            );
          } else if (route.name === ScreenNames.MYADS) {
            iconName = focused
              ? "file-tray-stacked"
              : "file-tray-stacked-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = focused ? "person" : "person-outline";
          }

          // Return your custom icon component
          return (
            <View
              style={{
                height: height(3.5),
                width: height(3.5),
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {route.name === "myChat" && msg && (
                <View
                  style={{
                    backgroundColor: "red",
                    height: height(1),
                    width: height(1),
                    borderRadius: height(3),
                    marginLeft: height(3),
                  }}
                />
              )}
              <Ionicons
                name={iconName}
                size={focused ? height(3) : height(2.2)}
                color={focused ? AppColors.primary : "gray"}
              />
            </View>
          );
        },
        tabBarLabel: () => null, // Hide tab names
        tabBarStyle: {
          borderTopWidth: 0,
          borderTopRightRadius: width(5),
          borderTopLeftRadius: width(5),

          ...Platform.select({
            ios: {
              height: height(8),
              paddingTop: height(1),
              shadowColor: "black",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              // Additional iOS-specific styles
            },
            android: {
              elevation: 5,
              height: height(7),
              // Additional Android-specific styles
            },
          }),
          position: "absolute",
        },
      })}
    >
      <Tab.Screen
        name="StackHome"
        component={TestStack}
        options={{ headerShown: false }}
      />
      {!islogin ? (
        <Tab.Screen
          name="pre"
          component={PreLogin}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Tab.Screen
            name="myChat"
            component={ChatScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="tit"
            component={CategoryScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name={ScreenNames.MYADS}
            component={MyListingScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Tab.Navigator>
    // </DrawerSceneWrapper>
  );
};

export default BottomNav;
