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
    Icon,
    CheckBox
} from "react-native-elements";

import authStore from "../../Stores/AuthStore"

export default class SolveScreen extends Component {
    constructor() {
        super();

        this.state = {
            input: "",
            title: "",
            category: "SolveIntent",
            disabled: false,
        }

        this.inputChange = this.inputChange.bind(this);
        this.titleChange = this.titleChange.bind(this);
        this.continue = this.continue.bind(this);
        this.toggleCategory = this.toggleCategory.bind(this);

        this.inputRef = React.createRef();
        this.titleRef = React.createRef();
    }

    inputChange(value) {
        this.setState({
            input: value,
        });
    }

    titleChange(value) {
        this.setState({
            title: value
        })
    }

    continue() {
        let { input, title, category, disabled } = this.state,
            nogo = false;

        if(title.trim() == "") {
            this.titleRef.current.shake();
            nogo = true;
        }
        if(input.trim() == "") {
            this.inputRef.current.shake();
            nogo = true;
        }

        if(disabled || nogo) {
            return;
        }
        
        this.setState({
            disabled: true,
        });
        let { email, displayName, photoURL } = authStore.getUser();
        this.props.navigation.navigate("SolveContinue", {
            category,
            title,
            input,
            email,
            displayName,
            photoURL
        });
        this.setState({
            disabled: false
        });
    }

    toggleCategory() {
        let { category } = this.state;
        let new_category = "";

        if(category == "SolveIntent") {
            new_category = "ReportIntent"
        } else {
            new_category = "SolveIntent"
        }

        this.setState({
            category: new_category
        });
    }

    render() {
        let { category } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.imageContainer}>
                <Icon
                    name={category == "SolveIntent" ? "account-search" : "report"}
                    type={category == "SolveIntent" ? "material-community" : "material"}
                    color={Colors.darkYellow}
                    size={width / 5}
                    style={styles.icon}
                />
                <CheckBox
                        title="Mark this as a Report"
                        checked={category == "ReportIntent"}
                        onPress={this.toggleCategory}
                        iconType="antdesign"
                        checkedColor={Colors.yellow}
                        checkedIcon="checkcircle"
                        uncheckedIcon="checkcircleo"
                        containerStyle={{ 
                            backgroundColor: Colors.cream, 
                            borderRadius: width,
                            borderWidth: 0,
                        }}
                        center
                    />
                </View>
                <KeyboardAvoidingView 
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    style={styles.inputContainer}
                >
                    <Input
                        ref={this.titleRef}
                        textAlignVertical="top"
                        returnKeyType="next"
                        blurOnSubmit={true}
                        autoFocus
                        label={category == "SolveIntent" ? "Give your problem or question a title." : "Give your report a title."}
                        labelStyle={{
                            color: Colors.dark,
                            fontFamily: Fonts.standardFont,
                            fontSize: Fonts.standardSize,
                            paddingBottom: 5,
                        }}
                        inputContainerStyle={styles.inputContainerStyle}
                        clearButtonMode="while-editing"
                        placeholder={category == "SolveIntent" ? "I haven't seen any banana slugs." : "Banana slugs have infiltrated my dorm."}
                        onEndEditing={() => {
                            this.inputRef.current.focus()
                        }}
                        inputStyle={styles.title}
                        maxLength={100}
                        leftIcon={
                            <Icon
                                name="rename-box"
                                type="material-community"
                                size={16}
                            />
                        }
                        onChangeText={this.titleChange}
                        value={this.state.title}
                        disabled={this.state.disabled}
                    />
                    <Input
                        ref={this.inputRef}
                        textAlignVertical="top"
                        returnKeyType="done"
                        blurOnSubmit={true}
                        label={category == "SolveIntent" ? "Describe it below." : "Provide details below."}
                        labelStyle={{
                            color: Colors.dark,
                            fontFamily: Fonts.standardFont,
                            fontSize: Fonts.standardSize,
                            paddingBottom: 5,
                        }}
                        inputContainerStyle={styles.inputContainerStyle}
                        placeholder={category == "SolveIntent" ? "Tell us what's going on!" : "The banana slugs are doing what?!"}
                        multiline={true}
                        inputStyle={styles.input}
                        maxLength={1000}
                        leftIcon={
                            <Icon
                                name="text-subject"
                                type="material-community"
                                size={16}
                            />
                        }
                        leftIconContainerStyle={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start"
                        }}
                        onChangeText={this.inputChange}
                        value={this.state.input}
                        disabled={this.state.disabled}
                    />
                    <View style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "flex-end",
                        width,
                    }}>
                        { this.state.input && this.state.input.trim() != "" ?
                            <Button
                                title="Clear"
                                buttonStyle={{
                                    backgroundColor: "transparent",
                                    width: width / 4.5,
                                }}
                                titleStyle={{
                                    color: Colors.dark,
                                    fontFamily: Fonts.standardFont,
                                    fontSize: Fonts.standardSize
                                }}
                                icon={() => (
                                    <Icon
                                        name="close-circle"
                                        type="material-community"
                                        color={Colors.dark}
                                        size={16}
                                    />
                                )}
                                onPress={() => {
                                    this.setState({
                                        input: ""
                                    })
                                }}
                            />
                            :
                            null
                        }
                    </View>
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
                <View style={{flex:1}}></View>
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
        justifyContent: "center",
    },
    inputContainer: {
        flex: 3,
        width,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    inputContainerStyle: {
        backgroundColor: "white",
        borderRadius: 10,
        borderBottomWidth: 0,
        padding: 5
    },
    title: {
        fontFamily: Fonts.headerFont,
        fontSize: Fonts.standardSize,
        color: Colors.darkBlue,
    },
    input: {
        fontFamily: Fonts.standardFont,
        fontSize: Fonts.standardSize,
        color: Colors.darkBlue
    },
    buttonContainer: {
        marginBottom: height / 10,
    },
    button: {
        width: width / 4 * 3,
        borderRadius: width,
        backgroundColor: Colors.darkBlue,
    },
    buttonTitle: {
        fontFamily: Fonts.standardFont,
        fontSize: Fonts.standardSize,

    }
})