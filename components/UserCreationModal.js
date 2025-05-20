import { View, Text, Button, TextInput, Modal, Alert } from "react-native";
import { useState } from "react";
import { BlurView } from "expo-blur";

const UserCreationModal = ({ visible, onClose, onCreateUser, isCreating }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const resetFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  const handleCreate = () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      accountId: "acc-" + Date.now(),
    };    Promise.resolve(onCreateUser(userData))
      .then(() => {
        resetFields();
      })
      .catch((error) => {
        // Show error message to user
        Alert.alert(
          "Account Creation Failed",
          error.message || "Failed to create account. Please try again."
        );
      });
  };
  const handleClose = () => {
    resetFields();
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <BlurView
        tint="dark"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fafafa",
            padding: 20,
            borderRadius: 10,
            width: "80%",
            borderColor: "#black",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            // elevation: 5,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 15 }}>
            Create Your Account
          </Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            autoCapitalize="none"
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
            }}
          >
            <View style={{ marginHorizontal: 5 }}>
              <Button title="Cancel" onPress={handleClose} color="#666" />
            </View>
            <View style={{ marginHorizontal: 5 }}>
              <Button
                title={isCreating ? "Creating Account..." : "Create Account"}
                onPress={handleCreate}
                disabled={
                  !firstName || !lastName || !email || !password || isCreating
                }
              />
            </View>
          </View>
          {(!firstName || !lastName || !email || !password) && (
            <Text
              style={{
                color: "#666",
                fontSize: 12,
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Please fill in all fields to create your account
            </Text>
          )}
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 8,
    borderRadius: 5,
    width: "100%",
  },
};

export default UserCreationModal;
