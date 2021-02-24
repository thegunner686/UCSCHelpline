import EventEmitter from "events";
import dispatcher from "../Dispatcher";
import ActionTypes from "../ActionTypes";
import * as Google from 'expo-google-app-auth';
import firebase from "firebase";

class AuthStore extends EventEmitter {
    constructor() {
        super();

        this.user = null;
        this.newUser = false;
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
        this.newUserGuideComplete = this.newUserGuideComplete.bind(this);
    }
    
    hasUser() {
        return this.user != null;
    }

    getUser() {
        return this.user;
    }

    isNewUser() {
        return this.newUser;
    }

    async signIn() {
        // checks to make sure we aren't logging in someone that's already logged in
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

        // takes the google user and then authenticates the credentials with firebase
        let onSignIn = (googleUser) => {
            let unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
                unsubscribe();
                this.user = firebaseUser;
                if(this.user) {
                    console.log(this.user);
                    this.emit("SignInSuccess");
                    return;
                }
                if(!isUserEqual(googleUser, firebaseUser)) {
                    let credential = firebase.auth.GoogleAuthProvider.credential(
                        googleUser.idToken,
                        googleUser.accessToken
                    );
                    
                    firebase.auth().signInWithCredential(credential).then((user) => {
                        // at this stage we're all authenticated 
                        if(user.additionalUserInfo.isNewUser) {
                            this.newUser = true;
                        } else {
                            this.newUser = false;
                        }
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
        this.user = null;
        this.newUser = false;
        this.emit("SignOut");
    }

    newUserGuideComplete() {
        this.newUser = false;
        this.emit("NewUserGuideComplete");
    }

    persistenceSignIn() {
        return new Promise((resolve, reject) => {
            let listener = firebase.auth().onAuthStateChanged((user) => {
                listener();
                console.log(user);
                if(user) {
                    this.newUser = false;
                    this.user = user;
                    resolve();
                } else {
                    this.user = null;
                    reject();
                }
            })
        });
    }

    handleDispatch(payload) {
        switch(payload.type) {
            case ActionTypes.Auth.SignIn:
                this.signIn();
                break;
            case ActionTypes.Auth.SignOut:
                this.signOut();
                break;
            case ActionTypes.Auth.NewUserGuideComplete:
                this.newUserGuideComplete();
                break;
            default:
                break;
        }
    }
}

let authStore = new AuthStore();
dispatcher.register(authStore.handleDispatch.bind(authStore));
export default authStore;