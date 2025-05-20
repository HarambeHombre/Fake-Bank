import { View, Text } from "react-native";
import { formatMoney, formatDate } from "../utils/formatUtils";

const BankSystemView = ({ bankUser }) => {
  if (!bankUser) return null;

  const formatTransactionText = (transaction) => {
    const arrow = transaction.type === "send" ? "↑" : "↓";
    const statusColor =
      transaction.status === "completed" ? "#4CAF50" : "#FFA726";
    const amountColor = transaction.type === "send" ? "#FF5252" : "#4CAF50";

    return (
      <View
        key={transaction.id}
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",  
        }}
      >
        <View>
          <Text>
            {arrow} {transaction.description}
          </Text>
          <Text style={{ fontSize: 12, color: statusColor }}>
            {transaction.status}
            {transaction.status === "completed" &&
              ` • ${formatDate(transaction.date)}`}
          </Text>
        </View>
        <Text style={{ color: amountColor, fontWeight: "bold" }}>
          {formatMoney(transaction.amount)}
        </Text>
      </View>
    );
  };

  // Get the two most recent transactions
  const latestTransactions = bankUser.accountTransactions
    ? [...bankUser.accountTransactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 2)
    : [];

  return (
    <View style={{ padding: 10, backgroundColor: "#fafafa" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text style={{ fontWeight: "bold" }}>Bank System</Text>
        <Text style={{ color: "#666" }}>
          Balance: {formatMoney(bankUser.balance)}
        </Text>
      </View>
      {latestTransactions.length > 0 && (
        <View>
          {latestTransactions.map((transaction) => (
            <View key={transaction.id}>{formatTransactionText(transaction)}</View>
          ))}
        </View>
      )}
    </View>
  );
};

export default BankSystemView;
