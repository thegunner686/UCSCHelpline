import React, { Component } from "react";

import {
    StackActions
} from "@react-navigation/native"

import {
    View,
    Dimensions,
    Text
} from "react-native";

import {
    Image,
    Badge,
    Icon,
} from "react-native-elements";

import authStore from "../Stores/AuthStore";

import { Colors, Fonts } from "../styles";

let { width, height } = Dimensions.get("window");

export class LeftBar extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View
                style={{
                    width: width / 2,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    padding: 5
                }}
            >
                <Image
                    source={require("../../assets/ucsc_logo.png")}
                    style={{
                        width: 35,
                        height: 35,
                        borderRadius: 35,
                        marginLeft: 10
                    }}
                    placeholderStyle={{
                        backgroundColor: Colors.cream,
                        borderRadius: width
                    }}
                />
                <View style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center"
                }}>
                    <Text style={{
                        fontFamily: Fonts.headerFont,
                        fontSize: Fonts.standardSize,
                        color: Colors.darkBlue
                    }}>Helpline </Text>
                    <Text style={{
                        fontFamily: Fonts.standardFont,
                        fontSize: Fonts.tinySize,
                        color: Colors.darkBlue
                    }}>
                        Your personal guide to UCSC
                    </Text>
                </View>
            </View>
        )
    }
}

export class RightBar extends Component {
    constructor() {
        super();

        this.state = {
            bug: false,
            help: false,
            history: true,
            profile: true,
        };
    }

    componentDidMount() {
        let { hideBug, hideHelp, hideHistory, hideProfile } = this.props;
        
        this.setState({
            bug: false,
            help: false,
            history: !hideHistory,
            profile: !hideProfile
        });
    }

    render() {
        let { navigation, route, route_name } = this.props;
        let iconColor = Colors.darkBlue;
        return (
            <View
                style={{
                    width: width / 2,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: 5,
                    shadowOffset: {
                        width: 1,
                        height: 1
                    },
                    shadowRadius: 1,
                    shadowColor: "black",
                    shadowOpacity: 0.3,
                }}
            >
                {/* ReportBug Icon */}
                {
                    this.state.bug ?
                    <Icon
                        name="bug-outline"
                        type="material-community"
                        onPress={() => { navigation.dispatch(StackActions.push(route_name + "ReportBug")) }}
                        colors={iconColor}
                        containerStyle={{
                            marginRight: 20
                        }}
                        size={35}
                    />
                    :
                    null
                }

                {/* Help Icon */}
                {
                    this.state.help ?
                    <Icon
                        name="help"
                        type="entypo"
                        onPress={() => { navigation.dispatch(StackActions.push(route_name + "Help")) }}
                        color={iconColor}
                        containerStyle={{
                            marginRight: 25,
                        }}
                    />
                    :
                    null
                }

                {/* History Icon */}
                {
                    this.state.history ?
                    <View>
                        <Icon
                            name="archive"
                            type="entypo"
                            onPress={() => { navigation.dispatch(StackActions.push(route_name + "History")) }}
                            color={iconColor}
                            containerStyle={{
                                marginRight: 25
                            }}
                            size={30}
                        />
                        {
                            this.props.numChangedUserIntents > 0 ?
                            <Badge
                                status="success"
                                textStyle={{
                                    fontFamily: Fonts.standardFont,
                                    fontSize: Fonts.standardSize,
                                }}
                                containerStyle={{ 
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                }}
                                
                            />
                            :
                            null
                        }
                    </View>
                    :
                    null
                }

                {/* Profile Image */}
                {
                    this.state.profile ?
                    <Image
                        source={{ uri: authStore.getProfilePicture() }}
                        style={{
                            width: 35,
                            height: 35,
                            borderRadius: 10,
                            marginRight: 10
                        }}
                        onPress={() => { navigation.dispatch(StackActions.push(route_name + "Profile")) }}
                    />
                    :
                    null
                }
            </View>
        );
    }
}

export class BackButtonIcon extends Component {
    render() {
        return (
            <Icon
                name="chevron-left"
                type="material-community"
                color={Colors.darkBlue}
                size={30}
                style={{ margin:10 }}
            />
        )
    }
}

export class CloseButtonIcon extends Component {
    render() {
        return (
            <Icon
                name="close"
                type="material-community"
                color={Colors.darkBlue}
                size={30}
                style={{ margin:10 }}
            />
        )
    }
}