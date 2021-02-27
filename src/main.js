import firebase from "./firebase_config";

import React, { Component } from "react";

import {
    NavigationContainer
} from "@react-navigation/native";

import {
    createStackNavigator,
} from "@react-navigation/stack";

import {
    createMaterialBottomTabNavigator
} from "@react-navigation/material-bottom-tabs";

import SplashScreen from "./SplashScreen";

import {
    View,
    Dimensions,
    StyleSheet,
} from "react-native"

import {
    Icon,
    Image,
    Tooltip,
    Text
} from "react-native-elements"

// Unauthenticated
import EntryScreen from "./Unauthenticated/EntryScreen";

// Authenticated

// Home
import HomeScreen from "./Authenticated/Home/HomeScreen";

// Navigate
import NavigateScreen from "./Authenticated/Navigate/NavigateScreen";

// Report
import ReportBugScreen from "./Authenticated/ReportBugScreen";

// Solve
import SolveScreen from "./Authenticated/Solve/SolveScreen";
import SolveContinueScreen from "./Authenticated/Solve/SolveContinueScreen";

// Report
import ReportScreen from "./Authenticated/Report/ReportScreen";

// Settings
import SettingsScreen from "./Authenticated/Settings/SettingsScreen";

// Profile
import ProfileScreen from "./Authenticated/ProfileScreen";

// Help
import HelpScreen from "./Authenticated/HelpScreen"

// History
import HistoryScreen from "./Authenticated/HistoryScreen"

// New User
import GettingStartedScreen from "./NewUser/GettingStartedScreen";
import GuideNavigationScreen from "./NewUser/GuideNavigationScreen";
import GuideSolveScreen from "./NewUser/GuideSolveScreen";
import GuideReportScreen from "./NewUser/GuideReportScreen";

// Stores
import authStore from "./Stores/AuthStore";
import { Colors, Fonts } from "./styles";

let { width, height } = Dimensions.get("window")

let LeftBar = (props) => (
    <View
        style={{
            display: "flex",
            flexDirection: "row",
            width:  width / 2,
            alignItems: "center",
            justifyContent: "flex-start",
            padding: 5,
        }}
    >
        <Image
            source={require("../assets/ucsc_logo.png")}
            style={{
                width: 35,
                height: 35,
                borderRadius: 35,
                marginLeft: 10,
                shadowOffset: {
                    width: 1,
                    height: 1
                },
                shadowRadius: 1,
                shadowColor: "black",
                shadowOpacity: 0.3,
            }}
            placeholderStyle={{backgroundColor: Colors.cream, borderRadius: width}}
        />
    </View>
);

let RightBar = (props) => (
    <View 
        style={{
            display: "flex",
            flexDirection: "row",
            width:  width / 2,
            alignItems: "center",
            justifyContent: "flex-end",
            padding: 5,
            shadowOffset: {
                width: 1,
                height: 1
            },
            shadowRadius: 1,
            shadowColor: "black",
            shadowOpacity: 0.3,
        }}
    >
        <Icon
            name="bug-outline"
            type="material-community"
            onPress={() => {props.navigation.navigate("ReportBug")}}
            color={Colors.darkBlue}
            containerStyle={{
                marginRight: 20
            }}
            size={35}
        />
        <Icon
            name="help"
            type="entypo"
            onPress={() => {props.navigation.navigate("Help")}}
            color={Colors.darkBlue}
            containerStyle={{
                marginRight: 25
            }}
        />
        <Icon
            name="archive"
            type="entypo"
            onPress={() => {props.navigation.navigate("History")}}
            color={Colors.darkBlue}
            containerStyle={{
                marginRight: 25
            }}
            size={30}
        />
        <Image 
            source={{ uri: authStore.getProfilePicture() }}
            style={{
                width: 35,
                height: 35,
                borderRadius: 35,
                marginRight: 10
            }}
            onPress={() => {props.navigation.navigate("Profile")}}
        />
    </View>
)

const Stack = createStackNavigator();

let topInset = height / 15;

let NavigateStack = (props) => {
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
                    headerTransparent: true,
                    headerTitleStyle: {
                        fontFamily: Fonts.standardFont,
                        fontSize: Fonts.standardSize,
                        color: Colors.darkBlue
                    },
                    headerTitle: "",
                    headerLeft: () => LeftBar(props),
                    headerRight: () => RightBar(props)
                }}
            />
            <Stack.Screen
                name="ReportBug"
                component={ReportBugScreen}
            />
            <Stack.Screen
                name="Help"
                component={HelpScreen}
            />
            <Stack.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    headerTransparent: true,
                    headerTitleStyle: {
                        fontFamily: Fonts.standardFont,
                        fontSize: Fonts.standardSize,
                        color: Colors.darkBlue
                    },
                    headerBackTitleVisible: false,
                    headerTitle: "Your History",
                    headerBackImage: () => (
                        <Icon
                            name="chevron-left"
                            type="material-community"
                            color={Colors.darkBlue}
                            size={30}
                            style={{margin:10}}
                        />
                    ),
                }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
            />
        </Stack.Navigator>
    );
};

let SolveStack = (props) => {
    return (
        <Stack.Navigator
            headerMode="float"
            initialRouteName="Solve"
            screenOptions={{
                safeAreaInsets: { top: topInset }
            }}
        >
            <Stack.Screen
                name="Solve"
                component={SolveScreen}
                options={{
                    headerTransparent: true,
                    headerTitle: "",
                    headerTitleStyle: {
                        fontFamily: Fonts.standardFont,
                        fontSize: Fonts.standardSize,
                        color: Colors.darkBlue
                    },
                    headerLeft: () => LeftBar(props),
                    headerRight: () => RightBar(props)
                }}
                
            />
            <Stack.Screen
                name="SolveContinue"
                component={SolveContinueScreen}
                options={{
                    headerTitle:"",
                    headerTransparent: true,
                    headerBackTitleVisible: false,
                    headerBackImage: () => (
                        <Icon
                            name="chevron-left"
                            type="material-community"
                            color={Colors.darkBlue}
                            size={30}
                            style={{margin:10}}
                        />
                    ),
                    headerRight: () => RightBar(props)
                }}
            />
            <Stack.Screen
                name="ReportBug"
                component={ReportBugScreen}
            />
            <Stack.Screen
                name="Help"
                component={HelpScreen}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
            />
            <Stack.Screen
                name="History"
                component={HistoryScreen}
            />
        </Stack.Navigator>
    );
};

let ReportStack = () => {
    return (
        <Stack.Navigator
            headerMode="float"
            initialRouteName="Report"
            screenOptions={{
                safeAreaInsets: { top: topInset }
            }}
        >
            <Stack.Screen
                name="Report"
                component={ReportScreen}
                options={{
                    headerShown: false,
                }}
                
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
            />
        </Stack.Navigator>
    );
};

let HistoryStackScreen = (props) => (
    <Stack.Screen
        name="Intent History"
        component={HistoryScreen}
        options={{
            headerTransparent: true,
            headerBackTitle: "",
            headerTitle: "Your History",
            headerBackImage: () => (
                <Icon
                    name="chevron-left"
                    type="material-community"
                    color={Colors.darkBlue}
                    size={30}
                    style={{margin:10}}
                />
            ),
            headerRight: () => RightBar(props),
        }}
    />
)

const AuthenticatedTab = createMaterialBottomTabNavigator();

class Main extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            signedIn: false,
            isNewUser: false,
        };

        this.signingIn = this.signingIn.bind(this);
        this.signInSuccess = this.signInSuccess.bind(this);
        this.signInError = this.signInError.bind(this);
        this.signOut = this.signOut.bind(this);
        this.newUserChange = this.newUserChange.bind(this);
        this.signInAfterUserLoad = this.signInAfterUserLoad.bind(this);    }

    componentDidMount() {
        authStore.addListener("SigningIn", this.signingIn);
        authStore.addListener("SignInSuccess", this.signInSuccess);
        authStore.addListener("SignInError", this.signInError);
        authStore.addListener("SignOut", this.signOut);
        authStore.addListener("NewUserGuideComplete", this.newUserChange);


        authStore.addListener("UserChange", this.signInAfterUserLoad);

        authStore.persistenceSignIn().then(() => {

        }).catch((error) => {
            console.log(error);
            this.setState({
                loading: false
            });
        });
    }

    componentWillUnmount() {
        authStore.removeListener("SigningIn", this.signingIn);
        authStore.removeListener("SignInSuccess", this.signInSuccess);
        authStore.removeListener("SignInError", this.signInError);
        authStore.removeListener("SignOut", this.signOut);
        authStore.removeListener("NewUserGuideComplete", this.newUserChange);

    }

    signInAfterUserLoad() {
        if(authStore.authenticated()) {
            setTimeout(() => {
                this.setState({
                    signedIn: true,
                    isNewUser: authStore.isNewUser(),
                    loading: false,
                });
            }, 600);
            authStore.removeListener("UserChange", this.signInAfterUserLoad);
        }
    }

    signingIn() {
        this.setState({
            loading: true
        });
    }

    signInSuccess() {
        if(!authStore.authenticated()) {
            return;
        }
    }

    signInError() {
        this.setState({
            loading: false,
        })
    }

    signOut() {
        if(authStore.authenticated()) {
            return;
        }

        this.setState({
            signedIn: false,
            isNewUser: false
        });

        authStore.addListener("UserChange", this.signInAfterUserLoad);
    }

    newUserChange() {

        console.log("new");
        this.setState({
            isNewUser: authStore.isNewUser(),
        });
    }

    render() {
        return (
            <NavigationContainer>
                {this.state.loading ? 
                    <SplashScreen/>
                    :
                    (   this.state.signedIn ? 
                            this.state.isNewUser ?
                            <>
                                <Stack.Navigator mode="card">
                                    <Stack.Screen
                                        name="GettingStarted"
                                        mode="modal"
                                        component={GettingStartedScreen}
                                        options={{
                                            headerShown: false
                                        }}
                                    />
                                    <Stack.Screen
                                        name="GuideNavigation"
                                        component={GuideNavigationScreen}
                                        options={{
                                            headerShown: false
                                        }}
                                    />
                                    <Stack.Screen
                                        name="GuideSolve"
                                        component={GuideSolveScreen}
                                        options={{
                                            headerTintColor: Colors.blue,
                                            headerTitleStyle: {
                                                fontFamily: Fonts.standardFont,
                                                fontSize: Fonts.standardSize,
                                            },
                                            headerTransparent: true,
                                            headerTitle: "",
                                            headerBackTitle: "Navigate"
                                        }}
                                    />
                                    <Stack.Screen
                                        name="GuideReport"
                                        component={GuideReportScreen}
                                        options={{
                                            headerTintColor: Colors.blue,
                                            headerTitleStyle: {
                                                fontFamily: Fonts.standardFont,
                                                fontSize: Fonts.standardSize,
                                            },
                                            headerTransparent: true,
                                            headerTitle: "",
                                            headerBackTitle: "Solve"
                                        }}
                                    />
                                </Stack.Navigator>
                            </>
                            :
                            <AuthenticatedTab.Navigator 
                                barStyle={styles.tabBar}
                                initialRouteName="NavigateStack"
                                screenOptions= {({ route }) => ({
                                    tabBarIcon: ({ focus, color }) => {
                                        let name = "",
                                            type = "";

                                        switch(route.name) {
                                            case "NavigateStack":
                                                name = "map-marked-alt";
                                                type = "font-awesome-5";
                                            break;
                                            case "SolveStack":
                                                name = "account-search";
                                                type = "material-community";
                                            break;
                                            case "ReportStack":
                                                name = "report";
                                                type = "material";
                                            break;
                                        }

                                        return (
                                            <Icon 
                                                name={name} 
                                                type={type} 
                                                color={color} 
                                                reverse
                                            />
                                        )
                                    }
                                })}
                                activeColor = {Colors.lightBlue}
                                inactiveColor = {Colors.darkBlue}
                            >
                                <AuthenticatedTab.Screen
                                    name="NavigateStack"
                                    component={NavigateStack}
                                    options={{
                                        tabBarLabel: "",
                                        
                                    }}
                                    
                                />
                                <AuthenticatedTab.Screen
                                    name="SolveStack"
                                    component={SolveStack}
                                    options={{
                                        tabBarLabel: "",
                                    }}
                                />
                                <AuthenticatedTab.Screen
                                    name="ReportStack"
                                    component={ReportStack}
                                    options={{
                                        tabBarLabel: "",
                                    }}
                                />
                            </AuthenticatedTab.Navigator>
                        :
                        <Stack.Navigator>
                            <Stack.Screen 
                                name="Entry" 
                                component={EntryScreen}
                                options={{
                                    headerShown:false
                                }}
                                />
                        </Stack.Navigator>
                    )
                }
            </NavigationContainer>
        )
    }
}

let styles = StyleSheet.create({
    tabBar: {
        backgroundColor: "transparent",
        position: "absolute",
        left: (width / 1.5 / 4),
        borderTopWidth: 0,
        elevation: 0,
        width: width / 1.5,
        borderRadius: width,
        shadowColor: "black",
        shadowOpacity: 0.4,
        shadowOffset: {
            width: 1,
            height: 1,
        },
        marginBottom: 15,
    }
})

export default Main;