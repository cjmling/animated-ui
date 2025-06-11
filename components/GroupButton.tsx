import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface GroupButtonProps {
  buttons: {
    label: string;
    onPress: () => void;
  }[];
}

export const GroupButton: React.FC<GroupButtonProps> = ({ buttons }) => {
  return (
    <View style={styles.container}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            index === 0 && styles.firstButton,
            index === buttons.length - 1 && styles.lastButton,
          ]}
          onPress={button.onPress}
        >
          <Text style={styles.buttonText}>{button.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007AFF",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  firstButton: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  lastButton: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
