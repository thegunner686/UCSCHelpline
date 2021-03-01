import React, { Component } from "react";

import { Colors, Fonts } from "../../styles";

import * as AuthActions from "../../Actions/AuthActions";
import ActionTypes from "../../ActionTypes";

import { NavigationActions } from "@react-navigation/native"

import {
    SafeAreaView,
    Text,
    View,
    Dimensions,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from "react-native"

import {
    Button,
    Input,
    Image,
    Icon,
    CheckBox,
    Overlay
} from "react-native-elements";

import authStore from "../../Stores/AuthStore"

export default class SolveContinueScreen extends Component {
    constructor() {
        super();

        this.state = {
            title: "",
            input: "",
            email: "",
            displayName: "",
            photoURL: "",
            anonymous: false,
            overlay: false,
            sending: false,
            error: false,
            category: "SolveIntent"
        }

        this.sendMessage = this.sendMessage.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {
        let { title, input, email, displayName, photoURL, category } = this.props.route.params;
        this.setState({
            category,
            title,
            input,
            email,
            displayName,
            photoURL
        });
    }

    sendMessage() {
        let { title, input, anonymous, category } = this.state;
        this.setState({
            sending: true,
            overlay: true,
        });
        authStore.submitUserIntent(title, input, category, anonymous).then(() => {
            setTimeout(() => {
                this.setState({
                    sending: false,
                });
            }, 1000)
        }).catch((error) => {
            this.setState({
                sending: false,
                error: true,
            });
            console.log(error);
        })
    }

    goBack() {
        let { sending }  = this.state;
        if(sending) {
            return;
        }
        
        this.setState({
            title: "",
            input: "",
            email: "",
            category: "SolveIntent",
            displayName: "",
            photoURL: "",
            anonymous: false,
            overlay: false,
            sending: false,
            error: false,
        });

        this.props.navigation.navigate("NavigateStack");

        // this.props.navigation.popToTop();
        // setTimeout(() => {
        //     const backAction = NavigationActions.back({
        //         key: 'SolveStack',
        //       });
        //       this.props.navigation.dispatch(backAction);
        // }, 100)
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.imageContainer}>
                    {this.state.photoURL == "" ? 
                        null :
                        this.state.anonymous ?
                        <Icon 
                            type="material-community"
                            name="incognito"
                            reverse
                            raised
                            size={width / 6}
                            color={Colors.dark}
                        />
                        :
                        <Image 
                            source={{ uri: this.state.photoURL }}
                            style={{
                                width: width / 3,
                                height: width / 3,
                                borderRadius: 35,
                            }}
                        />
                    }
                    <CheckBox
                        title="Send Anonymously"
                        checked={this.state.anonymous}
                        onPress={() => { this.setState({ anonymous: !this.state.anonymous })}}
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
                <View style={styles.inputContainer}>
                    <Text style={styles.name}>
                            {this.state.anonymous ? "Anonymous Slug" : this.state.displayName}
                    </Text>
                    <Text style={
                        this.state.anonymous ?
                        [styles.email, {
                            textDecorationLine: 'line-through', 
                            textDecorationStyle: 'solid'
                        }] :
                        styles.email
                    }>
                        {this.state.email}
                    </Text>
                    <Input
                        textAlignVertical="top"
                        inputStyle={[styles.title, {
                            color: this.state.anonymous ? "white" : Colors.dark
                        } ]}
                        inputContainerStyle={{
                            borderBottomWidth: 0, 
                            padding: 5
                        }}
                        inputContainerStyle={[styles.inputContainerStyle, {
                            backgroundColor: this.state.anonymous ? Colors.brown : Colors.lightBrown
                        } ]}
                        leftIcon={
                            <Icon
                                name={this.state.category == "SolveIntent" ? "account-search" : "report"}
                                type={this.state.category == "SolveIntent" ? "material-community" : "material"}
                                color={this.state.anonymous ? "white" : Colors.dark}
                                size={16}
                            />
                        }
                        value={this.state.title}
                        editable={false}
                        dataDetectorTypes="all"
                    />
                    <Input
                        textAlignVertical="top"
                        multiline={true}
                        inputStyle={[styles.input, {
                            color: this.state.anonymous ? "white" : Colors.dark
                        } ]}
                        inputContainerStyle={{
                            borderBottomWidth: 0, 
                            padding: 5
                        }}
                        inputContainerStyle={[styles.inputContainerStyle, {
                            backgroundColor: this.state.anonymous ? Colors.brown : Colors.lightBrown
                        } ]}
                        maxLength={1000}
                        leftIcon={
                            <Icon
                                name="text-subject"
                                type="material-community"
                                color={this.state.anonymous ? "white" : Colors.dark}
                                size={16}
                            />
                        }
                        leftIconContainerStyle={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start"
                        }}
                        value={this.state.input}
                        editable={false}
                        dataDetectorTypes="all"
                    />
                </View>
                    <Button 
                        containerStyle={styles.buttonContainer}
                        buttonStyle={
                            this.state.anonymous ?
                            [styles.button, {
                                backgroundColor: Colors.dark
                            }] :
                            styles.button
                        }
                        titleStyle={styles.buttonTitle}
                        title="Send it"
                        onPress={this.continue}
                        disabled={this.state.sending}
                        icon={
                            <Icon
                                name="send"
                                type="font-awesome"
                                color="white"
                                style={{ marginRight: 10 }}
                            />
                        }
                        onPress={() => {
                            this.sendMessage();
                        }}
                    />
                <View style={{ flex: 1 }}></View>
                <View style={{ flex:1 }}></View>
                <Overlay 
                    animationType="slide"
                    backdropStyle={{ 
                        backgroundColor: this.state.error ? Colors.red : this.state.sending ? Colors.yellow : Colors.green, 
                        opacity: 0.2
                    }}
                    overlayStyle={styles.overlay}
                    isVisible={this.state.overlay} 
                    onBackdropPress={() => {
                        this.goBack();
                    }}
                >
                    <>
                    <View style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <Icon
                            name="send"
                            type="font-awesome"
                            color={this.state.sending ? Colors.yellow : this.state.error ? Colors.darkRed : Colors.green}
                            size={width / 4}
                            style={{ margin: height / 15 }}
                        />
                        <Text
                            style={{
                                fontFamily: Fonts.standardFont,
                                fontSize: Fonts.headerSize,
                                marginBottom: 20,
                            }}
                        >
                            {this.state.sending ?
                                "Delivering Your Message"
                                :
                                this.state.error ?
                                "Sorry! Your message failed to send."
                                :
                                "Message Delivered!"
                            }   
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Button 
                            buttonStyle={{
                                width: width / 4 * 3,
                                backgroundColor: this.state.error ? Colors.red : Colors.darkGreen
                            }}
                            containerStyle={{
                                borderRadius: width,
                            }}
                            disabledStyle={{ backgroundColor: Colors.dark }}
                            disabled={this.state.sending}
                            title={this.state.error ? "Exit" : "All done!"}
                            loading={this.state.sending}
                            onPress={() => {
                                this.goBack();
                            }}
                        />
                    </View>
                    </>
                </Overlay>
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
        flex: 2,
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
        justifyContent: "flex-start",
    },
    inputContainerStyle: {
        backgroundColor: Colors.lightBrown,
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
        color: Colors.darkBlue,
    },
    buttonContainer: {
        marginBottom: height / 20,
    },
    button: {
        width: width / 4 * 3,
        borderRadius: width,
        backgroundColor: Colors.darkYellow,
    },
    buttonTitle: {
        fontFamily: Fonts.standardFont,
        fontSize: Fonts.standardSize,
        color: "white",
    },
    name: {
        color: Colors.darkBlue,
        fontFamily: Fonts.titleFont,
        fontSize: Fonts.headerSize
    },
    email: {
        color: Colors.darkYellow,
        fontFamily: Fonts.standardFont,
        fontSize: Fonts.standardSize,
        padding: 5,
    },
    overlay: {
        backgroundColor: "white",
        width: width / 10 * 9,
        height: height / 10 * 7,
        borderRadius: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
    }
})