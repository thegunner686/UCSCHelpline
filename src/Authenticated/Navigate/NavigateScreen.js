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
    Button,
    Icon
} from "react-native-elements";

import AutoHeightWebView from "react-native-autoheight-webview";

export default class NavigateScreen extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.innerContainer}>
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
                            marginTop: -height / 10,
                            width: width / 20 * 19,
                        }}
                    />
                </View>
                <Button
                    
                    title=" Slugline Message"
                    type="solid"
                    titleStyle={{
                        fontFamily: Fonts.standardFont,
                        fontSize: Fonts.headerSize
                    }}
                    containerStyle={{
                        position: "relative",
                        bottom: height / 25
                    }}
                    buttonStyle={{
                        backgroundColor: Colors.darkGreen,
                        borderRadius: 10,
                    }}
                    icon={
                        <Icon
                            name="plus"
                            type="material-community"
                            color="white"
                        />
                    }
                    onPress={() => {
                        this.props.navigation.navigate("SolveStack")
                    }}
                    raised
                />
            </SafeAreaView>
        )
    }
}

let { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.cream,
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    innerContainer: {
        backgroundColor: Colors.cream,
        height: height / 10 * 8,
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
