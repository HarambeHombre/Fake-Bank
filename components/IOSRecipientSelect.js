import { View } from "react-native";
import { Picker } from '@react-native-community/picker';

const IOSRecipientSelect = ({ users, recipient, setRecipient }) => {
  return (
    <View style={{
      marginHorizontal: 10,
      marginVertical: 10,
      backgroundColor: '#f5f5f5',
      borderRadius: 10,
    }}>
      <Picker
        selectedValue={recipient?.id || ''}
        style={{
          width: '100%',
          height: 180,
        }}
        onValueChange={(itemValue) => {
          const selectedUser = users.find((u) => u.id === itemValue);
          setRecipient(selectedUser || null);
        }}
      >
        <Picker.Item
          label="-Select Recipient-"
          value=""
        />
        {users.map((user) => (
          <Picker.Item
            key={user.id}
            label={`${user.firstName} ${user.lastName}`}
            value={user.id}
          />
        ))}
      </Picker>
    </View>
  );
};

export default IOSRecipientSelect;
