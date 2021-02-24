import firebase from "./firebase_config";

import React, { Component } from "react";

import {
    NavigationContainer
} from "@react-navigation/native";

import {
    createStackNavigator, StackView
} from "@react-navigation/stack";

import SplashScreen from "./SplashScreen";

import { Text } from "react-native";

// Unauthenticated
import EntryScreen from "./Unauthenticated/EntryScreen";

// Authenticated
import HomeScreen from "./Authenticated/HomeScreen";

// New User
import GettingStartedScreen from "./NewUser/GettingStartedScreen";
import GuideNavigationScreen from "./NewUser/GuideNavigationScreen";
import GuideSolveScreen from "./NewUser/GuideSolveScreen";
import GuideReportScreen from "./NewUser/GuideReportScreen";

// Stores
import authStore from "./Stores/AuthStore";
import { Colors, Fonts } from "./styles";

const Stack = createStackNavigator();

class Main extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            signedIn: false,
            isNewUser: false,
        };

        this.signInSuccess = this.signInSuccess.bind(this);
        this.signInError = this.signInError.bind(this);
        this.signOut = this.signOut.bind(this);
        this.newUserChange = this.newUserChange.bind(this);
    }

    componentDidMount() {
        authStore.addListener("SignInSuccess", this.signInSuccess);
        authStore.addListener("SignInError", this.signInError);
        authStore.addListener("SignOut", this.signOut);
        authStore.addListener("NewUserGuideComplete", this.newUserChange);

        authStore.persistenceSignIn().then(() => {
            setTimeout(() => {
                this.setState({
                    signedIn: true,
                    isNewUser: false,
                    loading: false,
                });
            }, 600);
        }).catch((error) => {
            this.setState({
                loading: false
            });
        });
    }

    componentWillUnmount() {
        authStore.removeListener("SignInSuccess", this.signInSuccess);
        authStore.removeListener("SignInError", this.signInError);
        authStore.removeListener("SignOut", this.signOut);
        authStore.removeListener("NewUserGuideComplete", this.newUserChange);

    }

    signInSuccess() {
        if(!authStore.hasUser()) {
            return;
        }

        if(authStore.isNewUser()) {
            this.setState({
                signedIn: true,
                isNewUser: true,
            });
        } else {
            this.setState({
                signedIn: true,
                isNewUser: false,
            });
        }
    }

    signInError() {

    }

    signOut() {
        if(authStore.hasUser()) {
            return;
        }

        this.setState({
            signedIn: false,
            isNewUser: false
        });
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
                            <Stack.Navigator>
                                <Stack.Screen 
                                    name="Home" 
                                    component={HomeScreen}
                                    options={{
                                        headerShown: false
                                    }}
                                    />
                            </Stack.Navigator>
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

export default Main;