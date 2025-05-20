import { View, Text, TouchableOpacity } from "react-native";

const AndroidRecipientSelect = ({ users, recipient, setRecipient }) => {
  return (
    <View style={{
      marginHorizontal: 10,
      marginVertical: 10,
    }}>
      {users.map((user) => (
        <TouchableOpacity
          key={user.id}
          style={{
            padding: 15,
            backgroundColor: recipient?.id === user.id ? '#e8f5e9' : '#f5f5f5',
            borderRadius: 10,
            marginBottom: 8,
            borderWidth: recipient?.id === user.id ? 1 : 0,
            borderColor: '#4CAF50'
          }}
          onPress={() => setRecipient(user)}
        >
          <Text style={{
            color: recipient?.id === user.id ? '#4CAF50' : '#000',
            fontSize: 16
          }}>
            {user.firstName} {user.lastName}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AndroidRecipientSelect;
