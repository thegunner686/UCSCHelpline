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

import EntryScreen from "./Unauthenticated/EntryScreen";
import HomeScreen from "./Authenticated/HomeScreen";

const Stack = createStackNavigator();

class Main extends Component {
    constructor() {
        super();
        this.state = {
            loadingApp: true,
            signedIn: false,
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
                this.setState({
                    loadingApp: false,
                    signedIn: true,
                });
            } else {
                this.setState({
                    loadingApp: false,
                    signedIn: false,
                });
            }
        });
    }

    render() {
        return (
            <NavigationContainer>
                {this.state.loadingApp ? 
                    <SplashScreen/>
                    :
                    (   this.state.signedIn ? 
                        <Stack.Navigator>
                            <Stack.Screen 
                                name="Home" 
                                component={HomeScreen}
                                options={{
                                    headerShown:false
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