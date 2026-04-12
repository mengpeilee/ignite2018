import React, { Component } from "react";
import { View, StatusBar, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import { Actions } from "react-native-router-flux";
import ReduxThunk from "redux-thunk";
import data from "./Setting.json";
import SceneRouter from "./components/SceneRouter";
import { ifIphoneX } from "./components/IphoneXDetector";
import reducers from "./reducers";

const middleware = [ReduxThunk, __DEV__ && logger].filter(Boolean); // filter(Boolean) 會過濾掉false，但true會留著
class App extends Component {
  componentDidMount() {
    // No backend: decide navigation based on stored session values
    this.renderScene();
  }

  renderScene() {
    // Check AsyncStorage for a stored session and navigate accordingly
    (async () => {
      try {
        const sessionToken = await AsyncStorage.getItem("sessionToken");
        const userID = await AsyncStorage.getItem("userID");
        const gmBatch = await AsyncStorage.getItem("gm_batch");
        if (sessionToken && userID) {
          if (gmBatch) {
            Actions.gm();
          } else {
            Actions.main();
          }
        } else {
          Actions.login();
        }
      } catch (e) {
        Actions.login();
      }
    })();
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(...middleware));
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <View style={styles.statusBarStyle} />
          <SceneRouter />
        </View>
      </Provider>
    );
  }
}

const styles = {
  statusBarStyle: {
    ...Platform.select({
      ios: {
        ...ifIphoneX(
          {
            paddingTop: 44,
            height: 18,
            backgroundColor: "white",
          },
          {
            paddingTop: 20,
            height: 18,
            backgroundColor: "white",
          },
        ),
      },
      android: {
        height: 0,
      },
    }),
  },
};

export default App;
