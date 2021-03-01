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
    Input,
    Icon,
    CheckBox,
    BottomSheet,
    ListItem
} from "react-native-elements";

import * as ImagePicker from "expo-image-picker";

import { Colors, Fonts } from "../styles";

import * as AuthActions from "../Actions/AuthActions"
import authStore from "../Stores/AuthStore";
import { TouchableWithoutFeedback } from "react-native";

export default class ProfileScreen extends Component {
    constructor() {
        super();

        this.state = {
            editing: false,
            pronouns: "",
            college: "",
            grad_year: "",
            phoneNumber: "",
            displayName: "",
            photoURL: "",
            loading: false,
            email: ""
        }

        this.onUserChange = this.onUserChange.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.pickImage = this.pickImage.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }

    componentDidMount() {
        authStore.addListener("UserChange", this.onUserChange);

        this.onUserChange();
    }

    componentWillUnmount() {
        authStore.removeListener("UserChange", this.onUserChange);
    }

    onUserChange() {
        let user = authStore.getUser();

        let { displayName, pronouns, college, grad_year, phoneNumber, photoURL, email } = user;

        this.setState({
            displayName,
            pronouns,
            college,
            grad_year,
            phoneNumber,
            photoURL,
            email,
        })
    }

    async toggleEdit() {
        let { editing } = this.state;
        this.setState({
            editing: !editing
        });

        if(editing) {
            this.setState({
                editing: false,
                loading: true,
            })
            let { displayName, phoneNumber, pronouns, college, grad_year } = this.state;

            if(displayName.trim() == "") {
                alert("We need your name!");
                this.setState({
                    editing: true,
                    loading: false,
                })
                return;
            }

            let res = await authStore.updateProfileInformation({
                displayName,
                phoneNumber: phoneNumber ? phoneNumber : "",
                pronouns: pronouns ? pronouns : "",
                college: college ? college : "",
                grad_year: grad_year ? grad_year : ""
            });
            if(res != "Success") {
                alert("Failed to update profile information");

                this.setState({
                    editing: true,
                    loading: false,
                });
                return;
            }
            this.setState({
                loading: false,
            });
        }
    }

    async pickImage() {
        let { editing } = this.state;
        if(!editing) {
            return;
        }
        
        this.setState({
            editing: false,
            loading: true,
        })
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status != "granted") {
            alert("Please enable camera roll permissions.");
            this.setState({
                editing: true,
                loading: false,
            })
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0
        });

        if(!result.cancelled) {
            try {
                let res = await authStore.uploadProfilePicture(result.uri);
                console.log("ok")
                console.log(res)
                this.setState({
                    editing: true,
                    loading: false,
                })
                return
            } catch(e) {
                alert("Failed to upload profile picture");
                console.log(e);
                this.setState({
                    editing: true,
                    loading: false,
                })
                return;
            }
        } 

        this.setState({
            editing: true,
            loading: false,
        })
    }

    updateProfile(key, val) {
        this.setState({
            [key]: val
        });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={styles.topContainerLeft}>
                        <View style={{
                            flex: 3,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            alignItems: "flex-start",
                        }}>
                            {
                                this.state.photoURL == "" ?
                                <Icon
                                    name="person"
                                    type="material"
                                    size={width / 3}
                                />
                                :
                                <Image
                                    source={{ uri: this.state.photoURL }}
                                    style={{
                                        width: width / 3,
                                        height: width / 3,
                                        borderRadius: 35,
                                    }}
                                    placeholderStyle={{ backgroundColor: Colors.cream }}
                                />
                            }
                        </View>
                        <View style={{ 
                            flex: 1,
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center"
                        }}>
                            { this.state.editing || this.state.loading ?
                                <Button 
                                    type="clear"
                                    titleStyle={{
                                        fontFamily: Fonts.headerFont,
                                        fontSize: Fonts.standardSize,
                                        color: Colors.lightBlue
                                    }}
                                    title="Upload Picture"
                                    onPress={this.pickImage}
                                    disabled={this.state.loading}
                                    loading={this.state.loading}
                                />
                                :
                                null
                            }
                        </View>
                    </View>
                    <View style={styles.topContainerRight}>
                        <View style={{ 
                            flex: 1,
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center"
                        }}>
                            <Text style={{
                                color: Colors.darkYellow
                            }}>{this.state.email}</Text>
                        </View>
                        <View style={{ 
                            flex: 1,
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center"
                        }}>
                            <Button
                                type={this.state.editing ? "outline" : "solid"}
                                titleStyle={{
                                    fontFamily: Fonts.standardFont,
                                    fontSize: Fonts.standardSize,
                                    color: this.state.editing ? Colors.dark : Colors.dark
                                }}
                                buttonStyle={{
                                    backgroundColor: this.state.editing ? "transparent" : Colors.cream,
                                    borderColor: Colors.dark,
                                    width: width / 3
                                }}
                                
                                title={this.state.editing ? "Lock Profile" : "Unlock Profile"}
                                onPress={this.toggleEdit}
                                disabled={this.state.loading}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.middleContainer}>
                    <View style={styles.middleContainerTop}>
                        <Input
                            textAlignVertical="top"
                            label="Name"
                            inputStyle={styles.inputStyle}
                            labelStyle={styles.inputLabelStyle}
                            containerStyle={{ height: height / 15}}
                            inputContainerStyle={styles.inputContainerStyle}
                            value={this.state.displayName}
                            editable={this.state.editing}
                            dataDetectorTypes="all"
                            onChangeText={(val) => {
                                this.updateProfile("displayName", val)
                            }}
                        />

                        <Input
                            textAlignVertical="top"
                            label="Pronouns"
                            inputStyle={styles.inputStyle}
                            labelStyle={styles.inputLabelStyle}
                            inputContainerStyle={styles.inputContainerStyle}
                            containerStyle={{ height: height / 15}}
                            value={this.state.pronouns}
                            placeholder="Tell us your pronouns!"
                            editable={this.state.editing}
                            dataDetectorTypes="all"
                            onChangeText={(val) => {
                                this.updateProfile("pronouns", val)
                            }}
                        />

                        <Input
                            textAlignVertical="top"
                            label="Phone Number"
                            inputStyle={styles.inputStyle}
                            labelStyle={styles.inputLabelStyle}
                            inputContainerStyle={styles.inputContainerStyle}
                            containerStyle={{ height: height / 15}}
                            value={this.state.phoneNumber}
                            placeholder="Not needed but nice to have."
                            editable={this.state.editing}
                            dataDetectorTypes="all"
                            onChangeText={(val) => {
                                this.updateProfile("phoneNumber", val)
                            }}
                        />
                    </View>
                    <View style={styles.middleContainerBottom}>
                        <View style={styles.middleContainerBottomLeft}>
                            <Input
                                textAlignVertical="top"
                                label="College Affiliation"
                                inputStyle={styles.inputStyle}
                                labelStyle={styles.inputLabelStyle}
                                inputContainerStyle={[styles.inputContainerStyle,
                                    {
                                        width: width / 3
                                    }
                                ]}
                                containerStyle={{ height: height / 15}}
                                value={this.state.college}
                                placeholder="Rep your college!"
                                editable={this.state.editing}
                                dataDetectorTypes="all"
                                onChangeText={(val) => {
                                    this.updateProfile("college", val)
                                }}
                            />
                        </View>
                        <View style={styles.middleContainerBottomRight}>
                            <Input
                                textAlignVertical="top"
                                label="Graduation Year"
                                inputStyle={styles.inputStyle}
                                labelStyle={styles.inputLabelStyle}
                                inputContainerStyle={[styles.inputContainerStyle,
                                    {
                                        width: width / 3
                                    }
                                ]}
                                containerStyle={{ height: height / 15}}
                                value={this.state.grad_year}
                                placeholder="2025"
                                editable={this.state.editing}
                                dataDetectorTypes="all"
                                onChangeText={(val) => {
                                    this.updateProfile("grad_year", val)
                                }}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <Button
                        type="solid"
                        onPress={() => {
                            AuthActions.SignOut();
                        }}
                        title="Sign Out"
                        titleStyle={{
                            fontFamily: Fonts.standardFont,
                            fontSize: Fonts.standardSize,
                            color: "white"
                        }}
                        buttonStyle={{
                            backgroundColor: Colors.darkYellow,
                            width: width / 4 * 3,
                            borderRadius: width,
                        }}
                        icon={
                            <Icon
                                name="logout"
                                type="material"
                                color="white"
                                style={{ marginRight: 10 }}
                            />
                        }
                        disabled={this.state.loading}
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
    // top
    topContainer: {
       flex: 3,
       width,
       backgroundColor: Colors.lightBrown,
       display: "flex",
       flexDirection: "row",
       alignItems: "center",
       justifyContent: "center",
       borderTopLeftRadius: 30,
       borderTopRightRadius: 30,
       marginTop: 10,
    },
    topContainerLeft: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    topContainerRight: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
    },

    // middle
    middleContainer: {
        flex: 7,
        width,
        backgroundColor: Colors.lightBrown,
        // backgroundColor: "green",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    middleContainerTop: {
        flex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    middleContainerBottom: {
        flex: 3,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        width: width / 10 * 9.5,
    },
    middleContainerBottomLeft: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    middleContainerBottomRight: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    inputContainerStyle: {
        borderBottomWidth: 0, 
        padding: 5,
        backgroundColor: "white",
        width: width / 10 * 9,
        borderRadius: 10,
        height: 35,
        margin: 0,
    },
    inputLabelStyle: {
        fontFamily: Fonts.headerFont,
        fontSize: Fonts.standardSize,
        color: Colors.dark
    },
    inputStyle: {
        fontFamily: Fonts.standardFont,
        fontSize: Fonts.standardSize,
        color: Colors.dark,
    },
    disabledInputStyle: {

    },

    // bottom
    bottomContainer: {
        flex: 3,
        width,
        // backgroundColor: "blue",
        backgroundColor: Colors.lightBrown,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
    }
})