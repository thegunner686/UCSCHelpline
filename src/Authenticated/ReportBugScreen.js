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

export default class ReportBugScreen extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <SafeAreaView>
                <Text>Report a Bug to SlugLine</Text>
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