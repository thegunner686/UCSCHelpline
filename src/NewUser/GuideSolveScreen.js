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

export default class GuideSolveScreen extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content"/>
                <View style={styles.imageContainer}>
                    <Icon
                        name="account-search"
                        type="material-community"
                        color={Colors.darkYellow}
                        size={width / 4}
                        style={styles.icon}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.header}>Solve & Get Answers</Text>
                    <Text style={styles.standard}>
                        Use the Solve tab to ask a student leader how to solve a problem
                        you're having on campus or get answers to questions you have. This
                        could range from anything like, "What classes should I take for my major",
                        or to "How can I utilize campus resources like CARE?".
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
                        name="circle"
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
                </View>
                <View style={styles.buttonContainer}>
                    <Button 
                        type="clear"
                        title="Next"
                        titleStyle={styles.nextButtonTitle}
                        buttonStyle={styles.nextButton}
                        containerStyle={styles.nextButtonContainer}
                        onPress={() => { this.props.navigation.navigate("GuideReport")}}
                        icon={
                            <Icon
                                name="chevron-right"
                                type="material-community"
                                color="white"
                            />
                        }
                        iconRight
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