import { View, Text, Button } from "react-native";
import { formatMoney } from "../utils/formatUtils";

const UserListView = ({ users, onSelectUser }) => {
  if (!users || users.length === 0) return null;
  const formatTransactionText = (transaction) => {
    const arrow = transaction.type === 'send' ? '→' : '←';
    const text = `${arrow} [${transaction.status}] ${formatMoney(transaction.amount)} - ${transaction.description}`;
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Text>{text}</Text>
      </View>
    );
  };

  return users.map(user => (
    <View key={user.accountId} style={{ padding: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>{user.firstName + ' ' + user.lastName + ' - Balance: ' + formatMoney(user.balance)}</Text>
        <Button
          title="Transfer"
          onPress={() => onSelectUser(user)}
        />
      </View>
      {user.accountTransactions?.length > 0 && (
        <View style={{ marginLeft: 20 }}>
          <Text>Transactions:</Text>
          {[...user.accountTransactions].reverse().map(transaction => (
            <View key={transaction.id}>
              {formatTransactionText(transaction)}
            </View>
          ))}
        </View>
      )}
    </View>
  ));
};

export default UserListView;
