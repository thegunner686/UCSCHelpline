import EventEmitter from "events";
import dispatcher from "../Dispatcher";
import ActionTypes from "../ActionTypes";
import * as Google from 'expo-google-app-auth';
import firebase from "firebase";

class AuthStore extends EventEmitter {
    constructor() {
        super();

        this.user = null;
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    getState() {
        return {
            user: this.user
        };
    }

    async signIn() {

        let isUserEqual = (googleUser, firebaseUser) => {
            if (firebaseUser) {
                var providerData = firebaseUser.providerData;
                for (var i = 0; i < providerData.length; i++) {
                  if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                      providerData[i].uid === googleUser.getBasicProfile().getId()) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                  }
                }
              }
              return false;
        }

        isUserEqual = isUserEqual.bind(this);

        let onSignIn = (googleUser) => {
            let unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
                unsubscribe();
                this.user = firebaseUser;
                if(!isUserEqual(googleUser, firebaseUser)) {
                    let credential = firebase.auth.GoogleAuthProvider.credential(
                        googleUser.idToken,
                        googleUser.accessToken
                    );
                    
                    firebase.auth().signInWithCredential(credential).then((user) => {
                        this.user = user;
                        this.emit("SignInSuccess");
                    }).catch((error) => {
                        this.emit("SignInError");
                        console.log(error);
                    })
                }
            })
        }

        onSignIn = onSignIn.bind(this);

        let auth = await Google.logInAsync({
            iosClientId: "19714673101-hsin1uencrn77ikf9odn58mh8nthsd4n.apps.googleusercontent.com",
            scopes: ["profile", "email"]
        });

        if(auth.type === "success") {
            onSignIn(auth);
        } else {
            this.user = null;
            this.emit("SignInError");
        }
    }

    signOut() {
        firebase.auth().signOut();
        this.emit("SignOut");
    }

    handleDispatch(payload) {
        switch(payload.type) {
            case ActionTypes.Auth.SignIn:
                this.signIn();
                break;
            case ActionTypes.Auth.SignOut:
                this.signOut();
                break;
            default:
                break;
        }
    }
}

let authStore = new AuthStore();
dispatcher.register(authStore.handleDispatch.bind(authStore));
export default authStore;