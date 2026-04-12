import AsyncStorage from "@react-native-async-storage/async-storage";
// backend removed; use mock login
import { Actions } from "react-native-router-flux";
import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
} from "./types";

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text,
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text,
  };
};

export const loginUser = ({ username, password }) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });
    // Simulate login (accept any username/password).
    // For a GM account use username 'gm' to navigate to GM screens.
    Promise.resolve({
      id: username || "mock_user",
      attributes: {
        character: username === "gm" ? "gm" : "player",
        gm_batch: username === "gm" ? "國高" : undefined,
      },
    })
      .then(async (user) => {
        const sessionToken = "mock-session-token";
        await AsyncStorage.setItem("sessionToken", sessionToken);
        await AsyncStorage.setItem("userID", user.id);
        if (user.attributes && user.attributes.gm_batch) {
          await AsyncStorage.setItem("gm_batch", user.attributes.gm_batch);
        }
        loginUserSuccess(dispatch, user);
      })
      .catch((error) => {
        console.log(error);
        loginUserFail(dispatch);
      });
  };
};

const loginUserFail = (dispatch) => {
  dispatch({ type: LOGIN_USER_FAIL });
};

const loginUserSuccess = async (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user,
  });
  if (user.attributes.character === "gm") {
    await AsyncStorage.setItem("gm_batch", user.attributes.gm_batch);
    Actions.gm();
  } else {
    Actions.main();
  }
};
