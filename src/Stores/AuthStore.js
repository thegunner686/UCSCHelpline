import EventEmitter from "events";
import dispatcher from "../Dispatcher";
import ActionTypes from "../ActionTypes";
import * as Google from 'expo-google-app-auth';
import firebase from "firebase";

import { deepEqual, isObject } from "../utils";

class AuthStore extends EventEmitter {
    constructor() {
        super();

        this.intent_type_enum = ["NavigateIntent", "SolveIntent", "ReportIntent", "DebugIntent", "HelpIntent"];
        this.user = null;
        this.firebaseUser = null;
        this.user_intent_listeners = {};
        this.user_intents = {};
        this.changed_user_intents = [];
        this.newUser = false;
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
        this.newUserGuideComplete = this.newUserGuideComplete.bind(this);
        this.attachUserListener = this.attachUserListener.bind(this);
        this.updateFirebaseUser = this.updateFirebaseUser.bind(this);
        this.deactivateUserListener = null;
        this.photoURL = "";
        this.submitUserIntent = this.submitUserIntent.bind(this);
        this.updateIntents = this.updateIntents.bind(this);
        this.attachIntentListener = this.attachIntentListener.bind(this);
    }

    authenticated() {
        return this.user != null
    }
    
    hasUser() {
        return this.firebaseUser != null;
    }

    getUser() {
        return this.firebaseUser;
    }

    isNewUser() {
        return this.newUser;
    }

    getProfilePicture() {
        return this.firebaseUser ? this.firebaseUser.photoURL : this.photoURL;
    }

    async submitUserIntent(title, content, category, anonymous) {
        return new Promise((resolve, reject) => {
            this.emit("UserIntent");
            if(!this.authenticated() || !this.hasUser()) {
                this.emit("UserIntentError");
                reject("Not authenticated & connected to the database.");
                return;
            }

            if(category == "") {                
                this.emit("UserIntentError");
                reject("Improper category, must be of: NavigationIntent, SolveIntent, ReportIntent, DebugIntent, HelpIntent");
                return;
            }

            let ref = firebase.firestore().collection(category).doc().id;

            let { uid, displayName, photoURL, email } = this.firebaseUser;

            if(!uid || !displayName || !email) {
                this.emit("UserIntentError");
                reject("Database user is incomplete");
                return;
            }

            let anon_slug_photo_url = "https://upload.wikimedia.org/wikipedia/commons/d/d8/SDS_UCSantaCruz_RedwoodSlug_WhiteGround.png",
                anon_slug_name = "Anonymous Slug"

            let time_created = Date.now();

            let intent = {
                ref,
                uid,
                photoURL: !anonymous && photoURL ? photoURL : anon_slug_photo_url,
                displayName: anonymous ? anon_slug_name : displayName,
                email,
                title,
                content,
                category,
                anonymous: anonymous ? true : false,
                time_created,
                received: true,
                assigned: false,
                resolved: false,
                responder: null,
                response: null,
            };

            firebase.firestore().collection(category).doc(ref).set(intent).then((res) => {
                firebase.firestore().collection("Users").doc(uid).update({
                    num_intents: firebase.firestore.FieldValue.increment(1),
                    intents: firebase.firestore.FieldValue.arrayUnion({
                        ref,
                        category
                    })
                }).then((res) => {
                    this.emit("UserIntentSubmitted");
                    resolve(intent);
                });
            }).catch((error) => {
                this.emit("UserIntentError");
                reject(error);
            })
            
        });
    }

    getNumChangedUserIntents() {
        return this.changed_user_intents.length;
    }

    getChangedUserIntents() {
        let intents = this.changed_user_intents;
        this.changed_user_intents = [];
        this.emit("ChangedUserIntentsFlushed");
        return intents;
    }

    getUserIntents() {
        return this.user_intents;
    }

    resolveIntent(category, ref, resolve_val) {
        return new Promise((resolve, reject) => {
            firebase.firestore().collection(category).doc(ref).update({
                resolved: resolve_val
            }).then((res) => {
                resolve(resolve_val);
            }).catch((error) => {
                reject(error);
            })
        });
    }

    deleteIntent(category, ref) {
        let { uid } = this.firebaseUser;
        return new Promise((resolve, reject) => {
            firebase.firestore().collection(category).doc(ref).delete().then((res) => {
                firebase.firestore().collection("Users").doc(uid).update({
                    num_intents: firebase.firestore.FieldValue.increment(-1),
                    intents: firebase.firestore.FieldValue.arrayRemove({
                        ref,
                        category
                    })
                }).then((res) => {
                    if(this.user_intent_listeners[ref]) {
                        this.user_intent_listeners[ref]();
                    }
                    resolve();
                }).catch((error) => {
                    reject(error);
                })
            }).catch((error) => {
                reject(error);
            })
        });
    }

    updateIntents() {
        let { intents, num_intents } = this.firebaseUser;
        if(num_intents == this.user_intents.length) {
            return;
        }

        if(!intents || intents.length == 0) {
            return;
        }

        intents.forEach((intent) => {
            if(!this.user_intents[intent.ref]) {
                this.user_intents[intent.ref] = intent;
                this.attachIntentListener(intent);
            }
        });
    }

    attachIntentListener(intent) {
        let listener = firebase.firestore().collection(intent.category).doc(intent.ref).onSnapshot((snapshot) => {
            let data = snapshot.data();
            if(data == undefined || data == null) {
                this.user_intents[intent.ref] = null;
                delete this.user_intents[intent.ref];
                this.emit("UserIntentChange");
                return;
            }

            if(!deepEqual(this.user_intents[intent.ref], data)) {
                this.user_intents[intent.ref] = data;
                this.changed_user_intents.push(data);
                this.emit("UserIntentChange");
            }
        }, (error) => {
            console.log(error);
        });
        this.user_intent_listeners[intent.ref] = listener;
    }

    attachUserListener(uid) {
        let db = firebase.firestore(),
            ref = db.collection("Users").doc(uid);
        this.deactivateUserListener = ref.onSnapshot(snapshot => {
            let data = snapshot.data();
            if(data == null) {
                this.signOut();
                return;
            }
            if(this.firebaseUser == null || !deepEqual(data, this.firebaseUser)) {
                this.firebaseUser = data;
                this.updateIntents();
                this.emit("UserChange");
            }
        }, (error) => {
            console.log(error);
        });
    }

    updateFirebaseUser(uid, user_data, cb) {
        let db = firebase.firestore();
        let ref = db.collection("Users").doc(uid);
        ref.set(user_data, {
            merge: true,
        });
        if(cb) {
            cb();
        }
    }

    async signIn() {
        // checks to make sure we aren't logging in someone that's already logged in
        let isUserEqual = (googleUser, firebaseUser) => {
            if (firebaseUser) {
                var providerData = firebaseUser.providerData;
                for (var i = 0; i < providerData.length; i++) {
                  // && providerData[i].uid === googleUser.getBasicProfile().getId()
                  if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                      providerData[i].uid === googleUser.user.id) {
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
                // deactivate the listener
                unsubscribe();

                let auth_user = firebaseUser,
                    uid = firebaseUser ? firebaseUser.uid : "",
                    user_data = {};

                // if the googleUser that's signed in isn't the same as the firebaseUser
                if(firebaseUser == null || !isUserEqual(googleUser, firebaseUser)) {
                    // the user is null or not equal to google user, so we must 
                    // sign in with google credential
                    let credential = firebase.auth.GoogleAuthProvider.credential(
                        googleUser.idToken,
                        googleUser.accessToken
                    );

                    // now that we have the google credential, sign into Firebase
                    firebase.auth().signInWithCredential(credential).then((fb_login) => {
                        let { user } = fb_login; // extract user from the firebase login
                        
                        // let's get our user and uid stored up
                        auth_user = user;
                        uid = auth_user.uid;
                        // check if its a new user
                        this.newUser = fb_login.additionalUserInfo.isNewUser
                        if(this.newUser) {
                            // new user was created and logged in
                            let creation_time = Date.now();
                            user_data = {
                                uid,
                                displayName: auth_user.displayName,
                                phoneNumber: auth_user.phoneNumber,
                                photoURL: auth_user.photoURL,
                                email: auth_user.email,
                                emailVerified: auth_user.emailVerified,
                                createdAt: creation_time,
                                lastLogin: creation_time,
                                intents: [],
                                num_intents: 0
                            }
                        } else {
                            // not a new user
                            let login_time = Date.now();
                            user_data = {
                                lastLogin: login_time,
                                phoneNumber: auth_user.phoneNumber,
                                emailVerified: auth_user.emailVerified
                            };
                        }

                        this.user = fb_login;

                        // attach listener to the user's firestore document
                        this.attachUserListener(uid);
        
                        // update the firestore document
                        this.updateFirebaseUser(uid, user_data);
                        
                    }).catch((error) => {
                        this.emit("SignInError");
                        console.log(error);
                    });

                } else {
                    // firebaseUser isn't null and its the same as the Google user, so we're signed in
                    // just update login time
                    let login_time = Date.now();
                    user_data = {
                        lastLogin: login_time
                    };

                    this.user = firebaseUser;

                    // attach listener to the user's firestore document
                    this.attachUserListener(uid);

                    // update the firestore document
                    this.updateFirebaseUser(uid, user_data);
                }
            }).bind(this);
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
        this.firebaseUser = null;
        this.newUser = false;
        if(this.deactivateUserListener) {
            this.deactivateUserListener();
        }
        Object.entries(this.user_intent_listeners).forEach((listener) => {
            listener[1]();
        });
        this.user_intent_listeners = {};
        this.user_intents = {};
        this.changed_user_intents = [];
        this.newUser = false;
        this.deactivateUserListener = null;
        this.photoURL = "";
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
                if(user) {
                    this.newUser = false;
                    this.user = user;

                    // attach user listener
                    this.attachUserListener(user.uid);

                    // update user
                    this.updateFirebaseUser(user.uid, {
                        lastLogin: Date.now()
                    });

                    resolve();
                } else {
                    this.user = null;
                    this.firebaseUser = null;
                    reject();
                }
            })
        });
    }

    handleDispatch(payload) {
        switch(payload.type) {
            case ActionTypes.Auth.SignIn:
                this.emit("SigningIn");
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