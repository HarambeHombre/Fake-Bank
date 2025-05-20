import { registerRootComponent } from 'expo';
import { StatusBar, View } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <HomeScreen />
      </View>
    </UserProvider>
  );
}

registerRootComponent(App);

export default App;

