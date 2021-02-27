import React, { Component } from "react";

import { Colors, Fonts } from "../../styles";

import * as AuthActions from "../../Actions/AuthActions";
import ActionTypes from "../../ActionTypes";

import {
    SafeAreaView,
    Text,
    Image,
    View,
    Dimensions,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from "react-native"

import {
    Button,
    Input,
    Icon
} from "react-native-elements";

import authStore from "../../Stores/AuthStore"

export default class SolveScreen extends Component {
    constructor() {
        super();

        this.state = {
            input: "",
            disabled: false,
        }

        this.inputChange = this.inputChange.bind(this);
        this.continue = this.continue.bind(this);

        this.inputRef = React.createRef();
    }

    inputChange(value) {
        this.setState({
            input: value,
        });
    }

    continue() {
        let { input, disabled } = this.state;
        if(disabled || input.trim() == "") {
            this.inputRef.current.shake();
            return;
        }
        this.setState({
            disabled: true,
        });
        let { email, displayName, photoURL } = authStore.getUser();
        this.props.navigation.navigate("SolveContinue", {
            input,
            email,
            displayName,
            photoURL
        });
        this.setState({
            disabled: false
        });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{flex:1}}></View>
                <View style={styles.imageContainer}>
                <Icon
                        name="account-search"
                        type="material-community"
                        color={Colors.darkYellow}
                        size={width / 4}
                        style={styles.icon}
                    />
                </View>
                <KeyboardAvoidingView 
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    style={styles.inputContainer}
                >
                    <Input
                        ref={this.inputRef}
                        textAlignVertical="top"
                        returnKeyType="done"
                        blurOnSubmit={true}
                        autoFocus
                        label="Describe your problem or question below."
                        labelStyle={{
                            color: Colors.dark,
                            fontFamily: Fonts.standardFont,
                            fontSize: Fonts.standardSize,
                        }}
                        
                        placeholder="Tell us what's going on!"
                        multiline={true}
                        inputStyle={styles.input}
                        maxLength={1000}
                        leftIcon={
                            <Icon
                                name="typewriter"
                                type="material-community"
                            />
                        }
                        onChangeText={this.inputChange}
                        value={this.state.input}
                        disabled={this.state.disabled}
                    />

                <Button 
                    containerStyle={styles.buttonContainer}
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonTitle}
                    title="Continue"
                    onPress={this.continue}
                    disabled={this.state.disabled}
                    icon={
                        <Icon
                            name="chevron-right"
                            type="material-community"
                            color="white"
                        />
                    }
                    iconRight
                />
                </KeyboardAvoidingView>
                <View style={{flex: 1}}></View>
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
    imageContainer: {
        flex: 1,
        width,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    inputContainer: {
        flex: 3,
        width,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    input: {
        fontFamily: Fonts.standardFont,
        fontSize: Fonts.headerSize,
        color: Colors.darkBlue,
    },
    buttonContainer: {
        marginBottom: height / 20,
    },
    button: {
        width: width / 4 * 3,
        borderRadius: width,
        backgroundColor: Colors.dark,
    },
    buttonTitle: {
        fontFamily: Fonts.standardFont,
        fontSize: Fonts.standardSize,

    }
})