import React, { Component } from "react";

import {
    SafeAreaView,
    View,
    Text,
    Dimensions,
    StyleSheet
} from "react-native";

import {
    Button,
    Image,
    Icon
} from "react-native-elements";

import { Colors, Fonts } from "../styles";

export default class HelpScreen extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <SafeAreaView>
                <Text>help screen</Text>
            </SafeAreaView>
        )
    }
}

let { width, height } = Dimensions.get("window");
let styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.cream,
        width,
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    }
})