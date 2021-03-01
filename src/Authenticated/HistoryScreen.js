import React, { Component } from "react";

import {
    SafeAreaView,
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from "react-native";

import {
    Button,
    Image,
    ListItem,
    Avatar,
    Icon,
    Overlay,
    ButtonGroup
} from "react-native-elements";

import * as Haptics from "expo-haptics";

import { formattedDateFromMilli, getIconForCategory } from "../utils";

import TouchableScale from 'react-native-touchable-scale';

import { Colors, Fonts } from "../styles";

import authStore from "../Stores/AuthStore";
import { LinearGradient } from "expo-linear-gradient";

class IntentDisplay extends Component {
    constructor(props) {
        super(props);

        this.go = this.go.bind(this);
        this.toggleDelete = this.toggleDelete.bind(this);
    }

    go() {
        let { intent, navigation, route_name } = this.props;
        navigation.navigate(route_name + "UserIntent", {
            intent,
        });
    }

    toggleDelete() {
        let { toggleDeleteOverlay, intent } = this.props;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).then(() => {
            toggleDeleteOverlay(intent.category, intent.ref);
        });
    }

    render() {
        let { intent } = this.props;
        let max_title_len = 35;
        // let title = intent.title.substr(0, max_title_len).trim();
        //     title = intent.title.length > max_title_len ? title + "..." : title;
        let title = "";
        intent.title.split(" ").map((w) => {
            if(title.length + w.length < max_title_len) {
                if(title.length > 0) {
                    title += " "
                }
                title += w;
                if(title.length >= max_title_len) {
                    title += "...";
                }
            }
        });

        let { iconName, iconType } = getIconForCategory(intent.category);
        return (
            <ListItem
                Component={TouchableScale}
                defaultScale={0.95}
                activeScale={0.80}
                friction={20}
                tension={150}
                containerStyle={{
                    borderRadius: 20,
                    margin: 5,
                    backgroundColor: intent.anonymous ? Colors.dark : "white",
                }}
                onPress={() => { this.go() }}
                onLongPress={() => {
                    this.toggleDelete()
                }}
            >
                <Icon
                    name={iconName}
                    type={iconType}
                    color={intent.resolved ? Colors.green : intent.assigned ? Colors.yellow : Colors.red}
                />
                <ListItem.Content>
                    <ListItem.Title
                        style={{
                            fontFamily: Fonts.headerFont,
                            fontSize: Fonts.standardSize,
                            color: intent.anonymous ? "white" : Colors.dark
                        }}
                    >
                        {title}
                    </ListItem.Title>
                    <ListItem.Subtitle
                        style={{
                            fontFamily: Fonts.standardFont,
                            fontSize: Fonts.standardSize,
                            color: intent.anonymous ? "white" : Colors.dark
                        }}
                    >
                        {formattedDateFromMilli(intent.time_created)}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle
                        style={{
                            fontFamily: Fonts.standardFont,
                            fontSize: Fonts.standardSize,
                            color: intent.anonymous ? "white" : Colors.dark
                        }}
                    >
                        { intent.anonymous ?
                            <Icon 
                                name="incognito" 
                                type="material-community"
                                color="white"
                                size={10}
                            />
                            :
                            null
                        }
                        {intent.displayName}
                    </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        )
    }
}

export default class HistoryScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_intents: {},
            overlay: false,
            sending: false,
            toDelete: null,
        };

        this.updateUserIntents = this.updateUserIntents.bind(this);
        this.hideDeleteOverlay = this.hideDeleteOverlay.bind(this);
        this.toggleDeleteOverlay = this.toggleDeleteOverlay.bind(this);
        this.deleteIntent = this.deleteIntent.bind(this);
    }

    componentDidMount() {
        authStore.addListener("UserIntentChange", this.updateUserIntents);

        this.updateUserIntents();
    }

    componentWillUnmount() {
        authStore.removeListener("UserIntentChange", this.updateUserIntents);
    }

    updateUserIntents(initial) {
        let intents = authStore.getUserIntents(),
            user_intents = {};

        authStore.getChangedUserIntents();

        intents = Object.keys(intents).map((key) => {
            if(intents[key] == null) {
                return;
            }
            user_intents[intents[key].ref] = intents[key];
        })

        this.setState({
            user_intents,
        });

        // if(changed_intents == {}) {
        //     this.setState({
        //         user_intents: {}
        //     });
        //     return;
        // }

        // console.log("HERE")

        // changed_intents = Object.entries(changed_intents).map((i) => i[1]);

        // authStore.getChangedUserIntents();

        // changed_intents.map((intent) => {
        //     user_intents[intent.ref] = intent;
        // });
    }

    toggleDeleteOverlay(category, ref) {
        this.setState({
            overlay: true,
            toDelete: {
                category,
                ref
            }
        })
    }

    hideDeleteOverlay() {
        let { sending } = this.state;
        if(sending) {
            return;
        }

        this.setState({
            overlay: false,
            error: false,
            sending: false,
            toDelete: null
        });
    }

    deleteIntent() {
        let { toDelete, sending } = this.state;
        if(sending || toDelete == null) {
            return;
        }

        this.setState({
            sending: true,
        });

        let { category, ref } = toDelete;

        authStore.deleteIntent(category, ref).then((res) => {
            this.setState({
                error: false,
                sending: false,
                overlay: false,
                toDelete: null
            })
        }).catch((error) => {
            console.log(error);
            this.setState({
                error: true,
                sending: false,
                overlay: false,
                toDelete: null
            })
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {
                    Object.keys(this.state.user_intents).length == 0 ?
                    <Text style={{ 
                        fontFamily: Fonts.standardFont,
                        fontSize: Fonts.headerSize,
                        marginTop: height / 5
                    }}>You have no Slugline History.</Text>
                    :
                    <ScrollView contentContainerStyle={styles.scrollView}>
                    {
                        Object.entries(this.state.user_intents).sort((i1, i2) => {
                            return i2[1].time_created - i1[1].time_created
                        }).map((intent) => (
                            <IntentDisplay {...this.props} key={intent[0]} toggleDeleteOverlay={this.toggleDeleteOverlay} intent={intent[1]}/>
                        ))
                    }
                    </ScrollView>
                }

                <View style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width,
                    height: height / 7,
                }}>
                    <LinearGradient
                        // Background Linear Gradient
                        colors={['rgba(255, 255, 255, 0)', "rgba(243, 240, 230, 0.9)", Colors.cream]}
                        style={{ width: width, height: height / 7}}
                    />
                </View>
                <Overlay 
                    animationType="slide"
                    backdropStyle={{ 
                        backgroundColor: Colors.red, 
                        opacity: 0.2
                    }}
                    overlayStyle={styles.overlay}
                    isVisible={this.state.overlay} 
                    onBackdropPress={() => {
                        this.hideDeleteOverlay();
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
                            name="delete-forever"
                            type="material-community"
                            color={Colors.red}
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
                                "Deleting..."
                                :
                                "Delete this item from your history?"
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
                                backgroundColor: Colors.darkRed
                            }}
                            containerStyle={{
                                borderRadius: width,
                            }}
                            disabledStyle={{ backgroundColor: Colors.dark }}
                            disabled={this.state.sending}
                            title={"Confirm"}
                            loading={this.state.sending}
                            onPress={() => {
                                this.deleteIntent();
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
let styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.cream,
        width,
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    scrollView: {
        paddingBottom: height / 10,
        paddingTop: height / 20,
        width: width,
        zIndex: 1
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