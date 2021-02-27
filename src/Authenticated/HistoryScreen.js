import React, { Component } from "react";

import {
    SafeAreaView,
    View,
    Text,
    Dimensions,
    StyleSheet,
} from "react-native";

import {
    Button,
    Image,
    ListItem,
    Avatar
} from "react-native-elements";

import { Colors, Fonts } from "../styles";

import authStore from "../Stores/AuthStore"

class IntentDisplay extends Component {
    constructor() {
        super();
    }

    render() {
        let { intent } = this.props;
        console.log("PROPS");
        console.log(intent);
        return (
            <Text>
                OK {intent.ref} {intent.displayName}
            </Text>
        )
    }
}

export default class HistoryScreen extends Component {
    constructor() {
        super();

        this.state = {
            user_intents: {}
        };

        this.updateUserIntents = this.updateUserIntents.bind(this);
    }

    componentDidMount() {
        authStore.addListener("UserIntentChange", this.updateUserIntents);

        this.updateUserIntents();
    }

    componentWillUnmount() {
        authStore.removeListener("UserIntentChange", this.updateUserIntents);
    }

    updateUserIntents(initial) {
        let { user_intents, user_intent_displays } = this.state,
            changed_intents;
        // if(initial) {
        //     changed_intents = authStore.getUserIntents();
        // } else {
            changed_intents = authStore.getChangedUserIntents();
        // }

        if(!changed_intents || changed_intents.length == 0) {
            return;
        }

        changed_intents.map((intent) => {
            user_intents[intent.ref] = intent;
        });

        this.setState({
            user_intents
        });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Intents</Text>
                {
                    Object.entries(this.state.user_intents).map((intent, key) => (
                        <IntentDisplay key={key} intent={intent}/>
                    ))
                }
            </SafeAreaView>
        )
    }
}

let { width, height } = Dimensions.get("window");
let styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.cream,
        width,
        height
    }
})