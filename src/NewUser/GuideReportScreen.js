import React, { Component } from "react";

import {
    SafeAreaView,
    Dimensions,
    StyleSheet,
    View,
    Text,
    StatusBar
} from "react-native";

import { Colors, Fonts } from "../styles";

import {
    Button,
    Icon
} from "react-native-elements";

import * as AuthActions from "../Actions/AuthActions";

export default class GuideReportScreen extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content"/>
                <View style={styles.imageContainer}>
                    <Icon
                        name="report"
                        type="material"
                        color={Colors.darkYellow}
                        size={width / 4}
                        style={styles.icon}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.header}>Report Issues</Text>
                    <Text style={styles.standard}>
                        With the same "+ Slugline Message" button, you can make a Report. Simply
                        tap on the "Mark this as a Report" button on the top of the page you're writing your message, 
                        and that will signal to our student leaders that critical steps may need to be taken to
                        resolve this issue.
                    </Text>
                </View>
                <View style={styles.progressBar}>
                    <Icon 
                        name="circle-outline"
                        type="material-community"
                        color={Colors.blue}
                        size={15}
                    />
                    <Icon 
                        name="circle-outline"
                        type="material-community"
                        color={Colors.blue}
                        size={15}
                    />
                    <Icon 
                        name="circle"
                        type="material-community"
                        color={Colors.blue}
                        size={15}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button 
                        type="clear"
                        title="Get Started"
                        titleStyle={styles.nextButtonTitle}
                        buttonStyle={styles.nextButton}
                        containerStyle={styles.nextButtonContainer}
                        onPress={() => { 
                            AuthActions.NewUserGuideComplete();
                        }}
                        icon={
                            <Icon
                                name="rocket-launch"
                                type="material-community"
                                color="white"
                                style={{ marginRight: 5 }}
                            />
                        }
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
    imageContainer: {
        flex: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        width: width,
    },
    icon: {
        margin: 10,
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
        margin: 5,
        fontFamily: Fonts.headerFont,
        fontSize: Fonts.headerSize,
        color: Colors.darkBlue,
    },
    standard: {
        fontFamily: Fonts.standardFont,
        fontSize: Fonts.standardSize,
        color: Colors.darkBlue,
        textAlign: "center",
        width: width / 4 * 3,
    },
    progressBar: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    buttonContainer: {
        flex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    nextButtonContainer: {
    },
    nextButton: {
        backgroundColor: Colors.dark,
        width: width / 4 * 3,
        borderRadius: width
    },
    nextButtonTitle: {
        color: "white",
        fontFamily: Fonts.standardFont,
        fontSize: Fonts.standardSize,
    }
});