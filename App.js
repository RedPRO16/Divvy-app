import React, { useState, useEffect } from "react";
import { RealmProvider } from "./app/createRealmContext";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Image, ImageBackground, TouchableHighlight } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Items from "./app/components/items";
import { useRealm } from "./app/createRealmContext";
import { Meal } from "./app/models/Meal";
import styles from "./app/common/styles";
import Users from "./app/components/users";

/*
 * Home Screen Functionality
 */
const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      style={styles.homeScreenBackground}
      source={require("./assets/background-image.png")}
      resizeMode={"cover"}
    >
      <View style={styles.homeScreenContainer}>
        <Image style={styles.divvyLogo} source={require("./assets/adaptive-icon.png")} />
        <TouchableHighlight style={styles.newMealsButton} onPress={() => navigation.navigate("Camera Screen")}>
          <Text style={styles.newMealsButtonText}>New Meals 🍽️</Text>
        </TouchableHighlight>
        <TouchableHighlight>
          <Text style={styles.myMealsButtonText}>My Meals 🍲</Text>
        </TouchableHighlight>
      </View>
    </ImageBackground>
  );
};

/*
 * Camera Screen Functionality
 */
const CameraScreen = ({ navigation, selectedMeal, setSelectedMeal, testVar }) => {
  const [createNewMeal, setCreateNewMeal] = useState(false);
  const [imageSource, setImageSource] = useState();
  const [imageObj, setImageObj] = useState();
  const realm = useRealm();

  return (
    <ImageBackground
      source={require("./assets/background-image-two.png")}
      resizeMode={"cover"}
      style={styles.cameraScreenBackground}
    >
      <View style={styles.cameraScreenContainer}>
        <TouchableHighlight onPress={() => navigation.navigate("🏠")}>
          <Text style={styles.cameraScreenBackButton}>⬅ Back</Text>
        </TouchableHighlight>
        <TouchableHighlight>
          <Text
            style={styles.createButton}
            onPress={() => {
              let newMeal;
              realm.write(() => {
                console.log("creating new meal");
                newMeal = realm.create("Meal", new Meal({}));
              });
              navigation.navigate("Meal Screen", { selectedMeal: newMeal });
            }}
          >
            Create ✨
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() =>
            launchImageLibrary(
              {
                cameraType: "back",
                mediaType: "photo",
                saveToPhotos: true,
                includeBase64: true,
              },
              (e) => {
                if (e.didCancel) {
                  console.log("cancelled");
                } else if (e.errorMessage) {
                  console.log("error: " + e.errorMessage);
                } else if (e.errorCode) {
                  console.log(e.errorCode);
                } else {
                  const source = {
                    uri: "data:image/jpeg;base64," + e.assets[0].base64,
                  };
                  setImageObj(
                    JSON.stringify({
                      image: e.assets[0].base64,
                      filename: e.assets[0].fileName,
                      contentType: e.assets[0].type,
                    })
                  );
                  setImageSource(source);
                }
              }
            )
          }
        >
          <Text style={styles.uploadButton}>Upload 📁</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => navigation.navigate("Save Photo Screen")}>
          <Text style={styles.cameraEmojiButton}>📸</Text>
        </TouchableHighlight>
      </View>
    </ImageBackground>
  );
};

/*
 * Save Photo Screen Functionality
 */
const SavePhotoScreen = ({ navigation }) => {
  return (
    <>
      <View style={styles.savePhotoContainer}>
        <TouchableHighlight onPress={() => navigation.navigate("Camera Screen")}>
          <Text style={styles.retakePhotoButton}>⬅ Retake</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => navigation.navigate("Camera Screen")}>
          <Text style={styles.usePhotoButton}>Use</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.photoScreenshotContainer}>
        <Text style={styles.photoScreenshot}>"Itemised Receipt functionality"</Text>
      </View>
    </>
  );
};

/*
 * Meal Screen Functionality
 */
const MealScreen = ({ navigation, route }) => {
  const [selectedMeal, setSelectedMeal] = useState(route.params.selectedMeal);
  const [selectedFriend, setSelectedFriend] = useState();
  return (
    <View style={styles.container}>
      <Items selectedMeal={selectedMeal} setSelectedMeal={setSelectedMeal} selectedFriend={selectedFriend} />
      <Users
        selectedMeal={selectedMeal}
        setSelectedMeal={setSelectedMeal}
        selectedFriend={selectedFriend}
        setSelectedFriend={setSelectedFriend}
      />
    </View>
  );
};

const Stack = createNativeStackNavigator();

/*
 * The main component which acts as a container for all other components within the the codebase.
 */
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="🏠" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Camera Screen" component={CameraScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Save Photo Screen" component={SavePhotoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Meal Screen" component={MealScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function AppWrapper() {
  return (
    <RealmProvider>
      <App />
    </RealmProvider>
  );
}
