import ActionTypes from "../ActionTypes";
import dispatcher from "../Dispatcher";

export function SignIn() {
    dispatcher.dispatch({
        type: ActionTypes.Auth.SignIn
    });
}

export function SignOut() {
    dispatcher.dispatch({
        type: ActionTypes.Auth.SignOut
    });
}