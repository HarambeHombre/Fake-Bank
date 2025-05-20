import { View, Text, Button, TextInput, Modal, Alert } from "react-native";
import { useState } from "react";
import { BlurView } from "expo-blur";

const LoginModal = ({ visible, onClose, onLogin, isLoggingIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const resetFields = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    Promise.resolve(onLogin({ email, password }))
      .then(() => {
        resetFields();
      })
      .catch(() => {
        // Keep fields on error
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
            Login to Your Account
          </Text>
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
                title={isLoggingIn ? "Logging in..." : "Login"}
                onPress={handleLogin}
                disabled={!email || !password || isLoggingIn}
              />
            </View>
          </View>
          {(!email || !password) && (
            <Text
              style={{
                color: "#666",
                fontSize: 12,
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Please enter your email and password
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

export default LoginModal;
