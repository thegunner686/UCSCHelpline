import React, { Component } from "react";

import {
    SafeAreaView,
    View,
    Text,
    Dimensions,
    StyleSheet,
} from "react-native";

import {
    Button,
    Image
} from "react-native-elements";

import { Colors, Fonts } from "../styles";

import * as AuthActions from "../Actions/AuthActions"
import authStore from "../Stores/AuthStore";

export default class ProfileScreen extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <SafeAreaView>
                <Text>Profile</Text>
                <Button
                    onPress={() => {
                        AuthActions.SignOut();
                    }}
                    title="sign out"
                />
            </SafeAreaView>
        )
    }
}

let { width, height } = Dimensions.get("window");
let styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.cream,
        width,
        height
    }
})