import React, { Component } from "react";

import {
    createStackNavigator,
} from "@react-navigation/stack";

import { 
    Dimensions 
} from "react-native";

import { Colors, Fonts } from "../styles";

// Main Screen
import NavigateScreen from "../Authenticated/Navigate/NavigateScreen";

// Header Screens
import ReportBugScreen from "../Authenticated/ReportBugScreen";
import HelpScreen from "../Authenticated/HelpScreen";
import HistoryScreen from "../Authenticated/HistoryScreen";
import UserIntentScreen from "../Authenticated/UserIntentScreen";
import ProfileScreen from "../Authenticated/ProfileScreen";

import {
    LeftBar,
    RightBar,
    BackButtonIcon
} from "./HeaderBar";

let Stack = createStackNavigator();

let { width, height } = Dimensions.get("window");

let topInset = height / 15;

export default class ReportStack extends Component {
    constructor() {
        super();
    }

    render() {
        let route_name = this.props.route.name;
        return (
            <Stack.Navigator
            headerMode="float"
            initialRouteName="Navigate"
            screenOptions={{
                safeAreaInsets: { top: topInset }
            }}
        >
            <Stack.Screen
                name="Navigate"
                component={NavigateScreen}
                options={{
                    headerStyle: {
                        backgroundColor: Colors.cream
                    },
                    headerTitle: "",
                    headerTitleStyle: {
                        fontFamily: Fonts.standardFont,
                        fontSize: Fonts.standardSize,
                        color: Colors.darkBlue
                    },
                    headerLeft: () => (
                        <LeftBar route_name={route_name} {...this.props} />
                    ),
                    headerRight: () => (
                        <RightBar route_name={route_name} {...this.props} />
                    )
                }}
            />
            <Stack.Screen
                name={route_name + "ReportBug"}
                component={ReportBugScreen}
            />
            <Stack.Screen
                name={route_name + "Help"}
                component={HelpScreen}
            />
            <Stack.Screen
                name={route_name + "History"}
                children={() => <HistoryScreen {...this.props} route_name={route_name}/>}
                options={{
                    headerStyle: {
                        backgroundColor: Colors.cream
                    },
                    headerTitleStyle: {
                        fontFamily: Fonts.standardFont,
                        fontSize: Fonts.standardSize,
                        color: Colors.darkBlue
                    },
                    headerBackTitleVisible: false,
                    headerTitle: "Your History",
                    headerBackImage: () => <BackButtonIcon route_name={route_name} {...this.props} />,
                    headerRight: () => (
                        <RightBar 
                            route_name={route_name}
                            {...this.props}
                            hideHelp={true}
                            hideBug={true}
                            hideHistory={true}
                        />
                    )
                }}
            />
            <Stack.Screen
                name={route_name + "UserIntent"}
                component={UserIntentScreen}
                options={{
                    headerStyle: {
                        backgroundColor: Colors.cream
                    },
                    headerTitleStyle: {
                        fontFamily: Fonts.standardFont,
                        fontSize: Fonts.standardSize,
                        color: Colors.darkBlue
                    },
                    headerBackTitleVisible: false,
                    headerTitle: "",
                    headerBackImage: () => <BackButtonIcon route_name={route_name} {...this.props} />,
                    headerRight: () => (
                        <RightBar 
                            route_name={route_name}
                            {...this.props}
                            hideHelp={true}
                            hideBug={true}
                            hideHistory={true}
                        />
                    )
                }}
            />
            <Stack.Screen
                name={route_name + "Profile"}
                component={ProfileScreen}
                options={{
                    headerStyle: {
                        backgroundColor: Colors.cream
                    },
                    headerTitleStyle: {
                        fontFamily: Fonts.standardFont,
                        fontSize: Fonts.standardSize,
                        color: Colors.darkBlue
                    },
                    headerBackTitleVisible: false,
                    headerTitle: "",
                    headerBackImage: () => <BackButtonIcon route_name={route_name} {...this.props} />,
                    headerRight: () => (
                        <RightBar 
                            route_name={route_name}
                            {...this.props}
                            hideHelp={true}
                            hideBug={true}
                            hideProfile={true}
                        />
                    )
                }}
            />
        </Stack.Navigator>
        )
    }
}