import React, { Component } from "react";

import { Colors } from "../styles";

import * as AuthActions from "../Actions/AuthActions";
import ActionTypes from "../ActionTypes";

import {
    SafeAreaView,
    Text,
    Image,
    Dimensions,
    StyleSheet
} from "react-native"

import {
    Button
} from "react-native-elements";

export default class HomeScreen extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Text>home</Text>
                <Button
                    onPress={() => {
                        AuthActions.SignOut();
                    }}
                    title="sign out"
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.cream
    }
})