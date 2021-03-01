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
    Text,
    Badge
} from "react-native-elements"

// Unauthenticated
import EntryScreen from "./Unauthenticated/EntryScreen";

// Authenticated

// Navigate
import NavigateScreen from "./Authenticated/Navigate/NavigateScreen";

// Report
import ReportBugScreen from "./Authenticated/ReportBugScreen";

// Solve
import SolveScreen from "./Authenticated/Solve/SolveScreen";
import SolveContinueScreen from "./Authenticated/Solve/SolveContinueScreen";

// Profile
import ProfileScreen from "./Authenticated/ProfileScreen";

// Help
import HelpScreen from "./Authenticated/HelpScreen"

// History
import HistoryScreen from "./Authenticated/HistoryScreen"
import UserIntentScreen from "./Authenticated/UserIntentScreen"

// New User
import GettingStartedScreen from "./NewUser/GettingStartedScreen";
import GuideNavigationScreen from "./NewUser/GuideNavigationScreen";
import GuideSolveScreen from "./NewUser/GuideSolveScreen";
import GuideReportScreen from "./NewUser/GuideReportScreen";

// Stacks
import ReportStack from "./Routes/ReportStack";
import NavigateStack from "./Routes/NavigateStack";
import SolveStack from "./Routes/SolveStack";

// Stores
import authStore from "./Stores/AuthStore";
import { Colors, Fonts } from "./styles";

let { width, height } = Dimensions.get("window")

const Stack = createStackNavigator();

let topInset = height / 15;

const AuthenticatedTab = createMaterialBottomTabNavigator();

class Main extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            signedIn: false,
            isNewUser: false,
            numChangedUserIntents: 0,
        };

        this.signingIn = this.signingIn.bind(this);
        this.signInSuccess = this.signInSuccess.bind(this);
        this.signInError = this.signInError.bind(this);
        this.signOut = this.signOut.bind(this);
        this.newUserChange = this.newUserChange.bind(this);
        this.signInAfterUserLoad = this.signInAfterUserLoad.bind(this);    
        this.userIntentChange = this.userIntentChange.bind(this);
    }

    componentDidMount() {
        authStore.addListener("SigningIn", this.signingIn);
        authStore.addListener("SignInSuccess", this.signInSuccess);
        authStore.addListener("SignInError", this.signInError);
        authStore.addListener("SignOut", this.signOut);
        authStore.addListener("NewUserGuideComplete", this.newUserChange);

        authStore.addListener("UserChange", this.signInAfterUserLoad);

        authStore.addListener("UserIntentChange", this.userIntentChange);
        authStore.addListener("ChangedUserIntentsFlushed", this.userIntentChange);

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
        authStore.removeListener("UserIntentChange", this.userIntentChange);
        authStore.removeListener("ChangedUserIntentsFlushed", this.userIntentChange);
    }

    userIntentChange() {
        let ci = authStore.getNumChangedUserIntents();
        this.setState({
            numChangedUserIntents: ci,
        });
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
                            // <AuthenticatedTab.Navigator 
                            //     sceneAnimationEnabled={true}
                            //     barStyle={styles.tabBar}
                            //     initialRouteName="NavigateStack"
                            //     screenOptions= {({ route }) => ({
                            //         tabBarIcon: ({ focus, color }) => {
                            //             let name = "",
                            //                 type = "";

                            //             switch(route.name) {
                            //                 case "NavigateStack":
                            //                     name = "map-marked-alt";
                            //                     type = "font-awesome-5";
                            //                 break;
                            //                 case "SolveStack":
                            //                     // name = "account-search";
                            //                     name = "text-box-search-outline"
                            //                     type = "material-community";
                            //                 break;
                            //                 case "ReportStack":
                            //                     name = "report";
                            //                     type = "material";
                            //                 break;
                            //             }

                            //             let size = 30;

                            //             return (
                            //                 <Icon 
                            //                     name={name} 
                            //                     type={type} 
                            //                     color={color} 
                            //                     size={size}
                            //                     containerStyle={{
                            //                         backgroundColor: color,
                            //                         width: size * 2,
                            //                         height: size * 2,
                            //                         borderRadius: size - size / 5,
                            //                         display: "flex",
                            //                         alignItems: "center",
                            //                         justifyContent: "center"
                            //                     }}
                            //                     reverse
                            //                 />
                            //             )
                            //         }
                            //     })}
                            //     activeColor = {Colors.lightBlue}
                            //     inactiveColor = {Colors.darkBlue}
                            // >
                            //     <AuthenticatedTab.Screen
                            //         name="NavigateStack"
                            //         options={{
                            //             tabBarLabel: ""
                            //         }}
                            //         children={(props) => <NavigateStack {...props} {...this.state}/>}
                            //     />
                            //     <AuthenticatedTab.Screen
                            //         name="SolveStack"
                            //         options={{
                            //             tabBarLabel: "",
                            //         }}
                            //         children={(props) => <SolveStack {...props} {...this.state}/>}
                            //     />
                            //     {/* <AuthenticatedTab.Screen
                            //         name="ReportStack"
                            //         options={{
                            //             tabBarLabel: "",
                            //         }}
                            //         children={(props) => <ReportStack {...props} {...this.state}/> }
                            //     >
                            //     </AuthenticatedTab.Screen> */}
                            // </AuthenticatedTab.Navigator>
                            <Stack.Navigator
                                options={{
                                    headerShown: false
                                }}
                                mode="modal"
                            >
                                <Stack.Screen
                                    name="NavigateStack"
                                    options={{
                                        tabBarLabel: "",
                                        headerShown: false
                                    }}
                                    children={(props) => <NavigateStack {...props} {...this.state}/>}
                                />
                                <Stack.Screen
                                    name="SolveStack"
                                    options={{
                                        tabBarLabel: "",
                                        headerShown: false
                                    }}
                                    children={(props) => <SolveStack {...props} {...this.state}/>}
                                />
                            </Stack.Navigator>
                        :
                        <Stack.Navigator>
                            <Stack.Screen 
                                name="Entry" 
                                children={props => <EntryScreen {...props} userIntentsChange={this.state.userIntentsChange}/>}
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
        left: (width / 4),
        borderTopWidth: 0,
        elevation: 0,
        width: width / 2,
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