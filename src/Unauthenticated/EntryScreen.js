import React, { Component } from "react";

import { Colors, Fonts } from "../styles";

import {
    SafeAreaView,
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet
} from "react-native"

import {
    Button
} from "react-native-elements";

import * as AuthActions from "../Actions/AuthActions";
import AuthStore from "../Stores/AuthStore";

export default class EntryScreen extends Component {
    constructor() {
        super();

        this.signInSuccess = this.signInSuccess.bind(this);
        this.signInError = this.signInError.bind(this);
    }

    componentDidMount() {
        AuthStore.addListener("SignInSuccess", this.signInSuccess);
        AuthStore.addListener("SignInError", this.signInError);
    }

    componentWillUnmount() {
        AuthStore.removeListener("SignInSuccess", this.signInSuccess);
        AuthStore.removeListener("SignInError", this.signInError);
    }

    signInSuccess() {
        
    }

    signInError() {
        console.log("error");
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.topContainer}>
                    <Image 
                        style={styles.logo}
                        source={require("../../assets/ucsc_logo.png")}
                    />
                    <Text style={styles.title}>SlugLine</Text>
                    <Text style={styles.tagline}>Your personal guide to UC Santa Cruz.</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <Button
                        title="UC Santa Cruz Log In"
                        type="solid"
                        onPress={() => {
                            AuthActions.SignIn();
                        }}
                        buttonStyle={styles.signUpButton}
                        titleStyle={styles.signUpButtonTitle}
                        raised={true}
                        icon={<Image
                            style={{width: 30, height: 30,marginRight: 10}}
                            source={require("../../assets/uc_seal.png")}
                        />}
                        iconLeft
                    />
                    {/* <Button
                        title="Log in"
                        buttonStyle={styles.logInButton}
                        titleStyle={styles.logInButtonTitle}
                        type="clear"
                    /> */}
                </View>
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
    topContainer: {
        flex: 20,
        width,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    buffer: {
        flex: 1,
    },
    buttonsContainer: {
        flex: 3,
        width,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        
    },
    title: {
        fontFamily: Fonts.titleFont,
        fontSize: Fonts.titleSize,
        color: Colors.darkBlue
    },
    tagline: {
        fontFamily: Fonts.standardFont,
        fontSize: Fonts.standardSize,
        color: Colors.darkBlue
    },
    logo: {
        width: width / 2,
        height: width / 2,
    },
    signUpButton: {
        width: width / 4 * 3,
        backgroundColor: Colors.darkBlue,
        borderRadius: width,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    signUpButtonTitle: {
        color: "white",
        fontFamily: Fonts.standardFont,
        fontSize: Fonts.standardSize
    },
    logInButton: {
        width: width / 4 * 3,
    },
    logInButtonTitle: {
        color: Colors.darkBlue,
        fontFamily: Fonts.standardFont,
        fontSize: Fonts.standardSize
    }
})