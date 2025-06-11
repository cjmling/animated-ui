import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface GroupButtonProps {
  buttons: {
    label: string;
    onPress: () => void;
  }[];
  selectedIndex: number;
}

export const GroupButton: React.FC<GroupButtonProps> = ({
  buttons,
  selectedIndex,
}) => {
  return (
    <View style={styles.container}>
      {buttons.map((button, index) => {
        const isSelected = index === selectedIndex;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              index === 0 && styles.firstButton,
              index === buttons.length - 1 && styles.lastButton,
              isSelected && styles.selectedButton,
              index !== 0 && styles.notFirstButton,
            ]}
            onPress={button.onPress}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.buttonText,
                isSelected
                  ? styles.selectedButtonText
                  : styles.unselectedButtonText,
              ]}
            >
              {button.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#D0D7DE",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  notFirstButton: {
    borderLeftWidth: 1,
    borderLeftColor: "#D0D7DE",
  },
  firstButton: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  lastButton: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  selectedButton: {
    backgroundColor: "#0050FF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  selectedButtonText: {
    color: "#fff",
  },
  unselectedButtonText: {
    color: "#6E7781",
  },
});
