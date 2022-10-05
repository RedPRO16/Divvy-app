import { View, Text, FlatList, TouchableOpacity } from "react-native";
import styles from "./common/styles";
import { useQuery } from "./createRealmContext";

export default SavedMealsScreen = ({ navigation }) => {
  const result = useQuery("Meal");

  const renderSavedMealListItem = (meal) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Meal Screen", { selectedMeal: meal })
        }
      >
        <Text>{getMealNameOrDate(meal)}</Text>
      </TouchableOpacity>
    );
  };

  const getMealNameOrDate = (meal) => {
    if (meal.name) return meal.name;
    const mealDateStr = new Date(Date.parse(meal.createdAt)).toDateString();
    return `Meal at ${mealDateStr}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalView}>
        <Text style={{ fontSize: 20 }}>Saved Meals:</Text>
        <FlatList
          style={{ height: 200 }}
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}
          data={result}
          renderItem={({ item }) => renderSavedMealListItem(item)}
          keyExtractor={(item) => item._id.toString()}
        />
        <TouchableOpacity onPress={() => navigation.navigate("Home Screen")}>
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
