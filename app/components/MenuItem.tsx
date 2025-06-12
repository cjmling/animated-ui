import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface MenuItemProps {
  href: string;
  label: string;
}

export function MenuItem({ href, label }: MenuItemProps) {
  return (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>{label}</Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  menuText: {
    fontSize: 16,
    color: "#007AFF",
  },
});
