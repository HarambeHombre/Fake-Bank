import {
  View,
  Text,
  Button,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useContext, useState, useCallback } from "react";
import { UserContext } from "../context/UserContext";
import TransferModal from "../components/TransferModal";
import UserCreationModal from "../components/UserCreationModal";
import LoginModal from "../components/LoginModal";
import LatestTransactionMessages from "../components/LatestTransactionMessages";
import BankSystemView from "../components/BankSystemView";
import UserListView from "../components/UserListView";
import HeaderView from "../components/HeaderView";
import { formatMoney, formatDate } from "../utils/formatUtils";
import {
  markTransactionRead,
  deleteTransaction,
} from "../utils/transactionUtils";

const HomeScreen = () => {
  const {
    users,
    createUser,
    refreshUsers,
    transferMoney,
    currentUser,
    login,
    logout,
  } = useContext(UserContext);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreatingUsers, setIsCreatingUsers] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [visibleTransactions, setVisibleTransactions] = useState(5);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshUsers();
    setVisibleTransactions(5); // Reset to initial count
    setRefreshing(false);
  }, [refreshUsers]);
  const handleCreateUser = async (userData) => {
    setIsCreatingUsers(true);
    try {
      // Create the user account first
      await createUser(userData);
      // Then automatically log them in with their credentials
      await login({
        email: userData.email,
        password: userData.password,
      });
      setShowCreateUserModal(false);
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to create user. Please try again."
      );
    } finally {
      setIsCreatingUsers(false);
    }
  };

  const handleTransfer = async (recipientId, amount) => {
    if (!currentUser) return;

    setIsTransferring(true);
    try {
      const success = await transferMoney(currentUser.id, recipientId, amount);
      if (success) {
        setShowTransferModal(false);
      } else {
        Alert.alert("Error", "Transfer failed. Please try again.");
      }
    } finally {
      setIsTransferring(false);
    }
  };

  // Filter out bank and current user from recipient list
  const availableRecipients = users.filter(
    (user) => user.id !== currentUser?.id && user.firstName !== "Bank"
  );

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
  const handleMarkRead = useCallback(
    async (transaction) => {
      if (!currentUser) return;
      try {
        await markTransactionRead(
          currentUser.id,
          transaction.id,
          !transaction.read
        );
      } catch (error) {
        Alert.alert("Error", "Failed to update message status");
      }
    },
    [currentUser]
  );

  const handleDeleteMessage = useCallback(
    async (transaction) => {
      if (!currentUser) return;
      try {
        await deleteTransaction(currentUser.id, transaction.id);
      } catch (error) {
        Alert.alert("Error", "Failed to delete message");
      }
    },
    [currentUser]
  );

  return (
    <View style={{ flex: 1 }}>
      {!currentUser ? (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View
            style={{
              padding: 20,
              paddingTop: 60,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
              backgroundColor: "#f8f9fa",
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 5 }}>
              Welcome to FakeBank
            </Text>
            <Text style={{ fontSize: 16, color: "#666" }}>
              Please login or create an account to continue
            </Text>
          </View>

          <View style={{ padding: 20, flex: 1 }}>
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#eee",
                padding: 20,
                marginBottom: 20,
              }}
            >
              <Text
                style={{ fontSize: 18, marginBottom: 15, fontWeight: "bold" }}
              >
                Existing User?
              </Text>
              <Button
                title="Login to Your Account"
                onPress={() => setShowLoginModal(true)}
                color="#4CAF50"
              />
            </View>

            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#eee",
                padding: 20,
              }}
            >
              <Text
                style={{ fontSize: 18, marginBottom: 15, fontWeight: "bold" }}
              >
                New to FakeBank?
              </Text>
              <Button
                title="Create New Account"
                onPress={() => setShowCreateUserModal(true)}
                color="#666"
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <HeaderView
            currentUser={currentUser}
            onOpenMessages={() => setShowMessagesModal(true)}
            onLogout={logout}
          />
          <View style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <View style={{ padding: 20 }}>
                {currentUser.accountTransactions?.length > 0 ? (
                  <>
                    {[...currentUser.accountTransactions]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .slice(0, visibleTransactions)
                      .map(formatTransactionText)}
                    {currentUser.accountTransactions.length >
                      visibleTransactions && (
                      <TouchableOpacity
                        onPress={() =>
                          setVisibleTransactions((prev) => prev + 5)
                        }
                        style={{
                          padding: 10,
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "#4CAF50", fontSize: 16 }}>
                          Load more...
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <Text style={{ textAlign: "center", color: "#666" }}>
                    No transactions yet
                  </Text>
                )}
              </View>
              {availableRecipients.length > 0 ? (
                <View style={{ padding: 20 }}>
                  <Button
                    title="Make a Transfer"
                    onPress={() => setShowTransferModal(true)}
                  />
                </View>
              ) : (
                <View style={{ padding: 20 }}>
                  <Text style={{ textAlign: "center", color: "#666" }}>
                    No other users available for transfer
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#ccc",
              borderColor: "#black",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              // elevation: 5,
            }}
          >
            <BankSystemView
              bankUser={users.find((u) => u.firstName === "Bank")}
            />
          </View>
        </View>
      )}
      <UserCreationModal
        visible={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onCreateUser={handleCreateUser}
        isCreating={isCreatingUsers}
      />
      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={async (credentials) => {
          setIsLoggingIn(true);
          try {
            await login(credentials);
            setShowLoginModal(false);
          } catch (error) {
            Alert.alert("Error", error.message);
          } finally {
            setIsLoggingIn(false);
          }
        }}
        isLoggingIn={isLoggingIn}
      />
      <TransferModal
        visible={showTransferModal}
        selectedUser={currentUser}
        users={availableRecipients}
        onClose={() => setShowTransferModal(false)}
        onTransfer={handleTransfer}
        isTransferring={isTransferring}
      />
      <LatestTransactionMessages
        visible={showMessagesModal}
        onClose={() => setShowMessagesModal(false)}
        transactions={currentUser?.accountTransactions || []}
        onMarkRead={handleMarkRead}
        onDelete={handleDeleteMessage}
      />
    </View>
  );
};

export default HomeScreen;
