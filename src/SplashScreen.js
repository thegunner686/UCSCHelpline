import React, { Component } from "react";

import { Colors } from "./styles";

import {
    View,
    SafeAreaView, 
    Text,
    StyleSheet,
    Dimensions,
    Image,
    ActivityIndicator
} from "react-native";

export default class SplashScreen extends Component {
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require("../assets/ucsc_logo.png")}
                />
                {/* <Image
                    style={styles.loader}
                    source={require("../assets/loading_animation.gif")}
                />       */}
                <ActivityIndicator size="large" color={Colors.darkBlue}/>
            </SafeAreaView>
        )
    }
}

let { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fbf1d8",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    loader: {
        width: width / 8,
        height: width / 8,
    },
    logo: {
        width: width / 3,
        height: width / 3
    }
})