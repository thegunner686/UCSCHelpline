import React, { Component } from "react";

import { Colors, Fonts } from "../../styles";

import * as AuthActions from "../../Actions/AuthActions";
import ActionTypes from "../../ActionTypes";

import {
    SafeAreaView,
    ScrollView,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    View
} from "react-native"

import {
    Button
} from "react-native-elements";

import AutoHeightWebView from "react-native-autoheight-webview";

export default class NavigateScreen extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <AutoHeightWebView
                    viewportContent="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
                    customScript={`
                        document.getElementsByClassName("loading")[0].style.opacity = "0.3";
                        document.getElementById("mobile-nav").style.opacity = "0";
                        document.getElementById("mobile-nav").style.height = "0px";
                        document.getElementById("mobile-nav").style.pointerEvents = "none";
                        document.getElementById("header").style.opacity = "0";
                        document.getElementById("header").style.height = "0px";
                        document.getElementById("header").style.pointerEvents = "none";
                        document.getElementById("main-grid").style.backgroundColor = "` + Colors.cream + `"
                    `}
                    scalesPageToFit={true}
                    source={{
                        uri: "https://maps.ucsc.edu"
                    }}
                    style={{
                        marginTop: -height / 20,
                    }}
                />
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
    },
    standard: {
        fontFamily: Fonts.standardFonts,
        fontSize: Fonts.standardSize,
        color: Colors.darkBlue
    }
})
