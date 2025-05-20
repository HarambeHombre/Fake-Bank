import {
  View,
  Text,
  Button,
  ScrollView,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useState } from "react";
import { formatMoney, formatDate } from "../utils/formatUtils";

const LatestTransactionMessages = ({
  visible,
  onClose,
  transactions,
  onMarkRead,
  onDelete,
}) => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Filter out deleted messages
  const activeTransactions = transactions.filter((t) => !t.deleted);
  const handleMessagePress = (transaction) => {
    // If pressing the same message again, collapse it
    if (selectedMessage?.id === transaction.id) {
      setSelectedMessage(null);
      return;
    }

    // Mark as read if unread and expand the message
    if (!transaction.read) {
      onMarkRead(transaction);
    }
    setSelectedMessage(transaction);
  };

  const handleDelete = (transaction) => {
    onDelete(transaction);
    setSelectedMessage(null);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <TouchableWithoutFeedback onPress={() => setSelectedMessage(null)}>
        <View
          style={{
            flex: 1,
            // backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              marginTop: 60,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderWidth: 3,
              borderColor: "#ccc",
            }}
          >
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                Messages
              </Text>
              <Text style={{ fontSize: 16, color: "#666" }}>
                Tap to read or delete
              </Text>
            </View>

            <ScrollView style={{ flex: 1 }}>
              <View style={{ padding: 20 }}>
                {activeTransactions.length > 0 ? (
                  activeTransactions.map((transaction) => (
                    <TouchableOpacity
                      key={transaction.id}
                      onPress={() => handleMessagePress(transaction)}
                      style={{
                        padding: 15,
                        borderWidth: 1,
                        borderColor: "#eee",
                        borderRadius: 10,
                        marginBottom: 10,
                        backgroundColor:
                          selectedMessage?.id === transaction.id
                            ? "#f5f5f5"
                            : "white",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 5,
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          {!transaction.read && (
                            <View
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "#4CAF50",
                                marginRight: 8,
                              }}
                            />
                          )}
                          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                            {transaction.type === "send" ? "Sent" : "Received"}{" "}
                            {formatMoney(transaction.amount)}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 12, color: "#666" }}>
                          {formatDate(transaction.date)}
                        </Text>
                      </View>
                      <Text style={{ color: "#666" }}>
                        {transaction.description}
                      </Text>

                      {selectedMessage?.id === transaction.id && (
                        <View
                          style={{
                            marginTop: 10,
                            borderTopWidth: 1,
                            borderTopColor: "#eee",
                            paddingTop: 10,
                            flexDirection: "row",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            title="Delete"
                            onPress={() => handleDelete(transaction)}
                            color="#FF5252"
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ textAlign: "center", color: "#666" }}>
                    No transaction messages
                  </Text>
                )}
              </View>
            </ScrollView>

            <View
              style={{
                padding: 20,
                borderTopWidth: 1,
                borderTopColor: "#ccc",
              }}
            >
              <Button title="Close" onPress={onClose} color="#666" />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LatestTransactionMessages;
