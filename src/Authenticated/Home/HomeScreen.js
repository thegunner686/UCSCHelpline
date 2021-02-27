import React, { Component } from "react";

import { Colors } from "../../styles";

import * as AuthActions from "../../Actions/AuthActions";
import ActionTypes from "../../ActionTypes";

import {
    SafeAreaView,
    Text,
    Dimensions,
    StyleSheet
} from "react-native"

import {
    Button,
    Image
} from "react-native-elements";

export default class HomeScreen extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                
            </SafeAreaView>
        )
    }
}

let { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.cream,
        width,
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    }
})