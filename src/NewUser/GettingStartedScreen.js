import React, { Component } from "react";

import {
    SafeAreaView,
    Text,
    Dimensions,
    StyleSheet,
    View
} from "react-native";
import { Colors, Fonts } from "../styles";
import { 
    Image,
    Button,
    Icon,
} from "react-native-elements"

export default class GettingStartedScreen extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image 
                        resizeMethod="auto"
                        resizeMode="contain"
                        style={styles.logo}
                        source={require("../../assets/ucsc_logo.png")}
                        placeholderStyle={{ backgroundColor: Colors.cream }}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.header}>Welcome to HelpLine!</Text>
                    <Text style={styles.standard}>Here's a getting started guide on your personal guide to UC Santa Cruz.</Text>
                </View>
                <View style={{flex: 1}}></View>
                <View style={styles.buttonContainer}>
                    <Button
                        type="clear"
                        containerStyle={styles.getStartedButtonContainer}
                        buttonStyle={styles.getStartedButton}
                        titleStyle={styles.getStartedButtonTitle}
                        icon={
                            <Icon
                                name="rocket"
                                type="entypo"
                                reverse
                                color={Colors.dark}
                                size={30}
                            />
                        }
                        iconRight
                        onPress={() => {
                            this.props.navigation.navigate("GuideNavigation");
                        }}
                    />
                </View>
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
        justifyContent: "center"
    },
    textContainer: {
        width: width,
        flex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 10,
    },
    header: {
        fontFamily: Fonts.headerFont,
        fontSize: Fonts.headerSize,
        color: Colors.darkBlue,
        margin: 5
    },
    standard: {
        fontFamily: Fonts.standardFont,
        fontSize: Fonts.standardSize,
        color: Colors.darkBlue,
        textAlign: "center",
        width: width / 4 * 3
    },
    imageContainer: {
        flex: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        width: width,
    },
    logo: {
        width: width / 3,
        height: width / 3,
        margin: 10
    },
    buttonContainer: {
        flex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    getStartedButtonContainer: {
        shadowColor: "black",
        shadowRadius: 2,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 1,
            height: 1,
        }
    },
    getStartedButton: {
        borderColor: Colors.darkBlue,
        width: width / 4 * 3,
        borderRadius: width,
    },
    getStartedButtonTitle: {
        fontFamily: Fonts.standardFont,
        fontSize: Fonts.standardSize,
        color: Colors.darkBlue
    }
})