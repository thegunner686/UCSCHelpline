import React, { Component } from "react";

import {
    SafeAreaView,
    View,
    Text,
    Dimensions,
    StyleSheet,
    ScrollView,
} from "react-native";

import {
    Button,
    Input,
    Image,
    Icon,
    Divider
} from "react-native-elements";
import authStore from "../Stores/AuthStore";

import { Colors, Fonts } from "../styles"
import { formattedDateFromMilli, getIconForCategory } from "../utils"

export default class UserIntentScreen extends Component {
    constructor() {
        super();

        this.state = {
            sending: false,
        }

        this.toggleResolved = this.toggleResolved.bind(this);
    }

    componentDidMount() {
        let { intent } = this.props.route.params;
        this.setState({
            ...intent
        })
    }

    toggleResolved() {
        let { category, resolved, ref } = this.state;

        this.setState({
            sending: true
        });
        
        authStore.resolveIntent(category, ref, !resolved).then((res) => {
            this.setState({
                resolved: res,
                sending: false,
            })
        }).catch((error) => {
            console.log(error);
            this.setState({
                sending: false,
            });
        })
    }

    render() {
        let { photoURL, displayName, email, content, response, category, 
              time_created, anonymous, title, responder, assigned, resolved } = this.state;

        let { iconName, iconType } = getIconForCategory(category);
        return (
            <SafeAreaView style={styles.container}>
                <View style={{
                    height: height / 5,
                    width,
                    padding: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start"
                }}>

                    <Icon
                        name={iconName}
                        type={iconType}
                        color={resolved ? Colors.green : assigned ? Colors.yellow : Colors.red}
                        size={40}
                    />
                    <Text style={{
                        fontFamily: Fonts.headerFont,
                        fontSize: Fonts.titleSize / 2
                    }}>
                        {title}
                    </Text>
                    <Text>{formattedDateFromMilli(time_created)}</Text>
                    {resolved ?
                        <Text style={[styles.status, { color: Colors.darkGreen }]}>Resolved</Text>
                        :
                        assigned ?
                            <Text style={[styles.status, { color: Colors.darkYellow }]}>Assigned</Text>
                            :
                            <Text style={[styles.status, { color: Colors.darkRed }]}>Not Assigned</Text>
                    }
                    <View style={{
                        width,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        paddingRight: 10
                    }}>
                        <Button
                            type="clear"
                            title={resolved ? "Mark As Unresolved" : "Mark As Resolved"}
                            titleStyle={{
                                fontFamily: Fonts.standardFont,
                                fontSize: Fonts.standardSize,
                                color: resolved ? Colors.darkRed : Colors.darkGreen
                            }}
                            onPress={this.toggleResolved}
                            disabled={this.state.sending}
                        />
                    </View>

                    <Divider style={{ height: 10, backgroundColor: Colors.red }} />
                </View>
                <ScrollView
                    contentContainerStyle={{
                        width,
                        padding: 10,
                    }}
                >
                    <View style={styles.messageContainer}>
                        {
                                anonymous ?
                                <Icon
                                    name="incognito"
                                    type="material-community"
                                    size={20}
                                    containerStyle={{ margin: 0 }}
                                />
                                :
                                <Image
                                    source={{ uri: photoURL }}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 5,
                                    }}
                                    placeholderStyle={{ backgroundColor: Colors.cream }}
                                />
                            }
                        <Input
                            textAlignVertical="top"
                            multiline={true}
                            inputStyle={styles.content}
                            inputContainerStyle={styles.userContainer}
                            label={displayName}
                            labelStyle={styles.label}
                            maxLength={1000}
                            value={content}
                            editable={false}
                            dataDetectorTypes="all"
                        />
                    </View>
                    <View style={styles.messageContainer}>
                        {
                            response ?
                            <>
                                <Icon
                                    name="person"
                                    type="material"
                                    size={20}
                                    containerStyle={{ margin: 0 }}
                                />
                                <Input
                                    textAlignVertical="top"
                                    multiline={true}
                                    inputStyle={styles.content}
                                    inputContainerStyle={styles.responderContainer}
                                    label={responder}
                                    labelStyle={styles.label}
                                    value={response}
                                    editable={false}
                                    dataDetectorTypes="all"
                                />
                            </>
                            :
                            <Text style={{
                                textAlign: "center"
                            }}>No Response Yet</Text>
                        }
                    </View>
                </ScrollView>
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
    label: {
        fontFamily: Fonts.headerFont,
        fontSize: Fonts.standardSize,
        color: Colors.dark
    },
    content: {
        fontFamily: Fonts.standardFont,
        fontSize: Fonts.standardSize,
        color: Colors.darkBrown,
    },
    userContainer: {
        flex: 1,
        borderBottomWidth: 0, 
        backgroundColor: Colors.lightBrown,
        borderRadius: 10,
        padding: 5,
        width: width / 10 * 8.5,
    },
    responderContainer: {
        borderBottomWidth: 0, 
        backgroundColor: "white",
        borderRadius: 10,
        padding: 5,
        width: width / 10 * 8.5,
    },
    messageContainer: {          
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    status: {
        fontFamily: Fonts.headerFont,
        fontSize: Fonts.standardSize
    }
})