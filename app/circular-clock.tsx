import { CircularClock } from "@/components/CircularClock";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CircularClockScreen() {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(30);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularClock hour={hour} minute={minute} />
      <View style={{ flexDirection: "row", gap: 10, marginTop: 50 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setHour(hour + 1)}
        >
          <Text style={styles.buttonText}>+ 1 hour</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setMinute(minute + 1)}
        >
          <Text style={styles.buttonText}>+ 1 minute</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setHour(Math.floor(Math.random() * 12) + 1);
            setMinute(Math.floor(Math.random() * 60));
          }}
        >
          <Text style={styles.buttonText}>Random</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    marginHorizontal: 2,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
});
