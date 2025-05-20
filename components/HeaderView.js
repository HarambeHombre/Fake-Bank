import { View, Text, TouchableOpacity } from "react-native";
import { formatMoney } from "../utils/formatUtils";
import { Ionicons } from "@expo/vector-icons";

const HeaderView = ({ currentUser, onOpenMessages, onLogout }) => {
  // Count unread messages
  const unreadCount =
    currentUser.accountTransactions?.filter((t) => !t.read && !t.deleted)
      ?.length || 0;

  return (
    <View
      style={{
        padding: 15,
        paddingTop: "60",
        backgroundColor: "#fafafa",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingBottom: 20,
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Welcome, {currentUser.firstName}!
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TouchableOpacity
              onPress={onOpenMessages}
              style={{
                padding: 8,
                position: "relative",
              }}
            >
              <Ionicons
                name="mail"
                size={28}
                color="#4CAF50"
                style={{
                  opacity: unreadCount > 0 ? 1 : 0.25,
                }}
              />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -2,
                    top: -2,
                    backgroundColor: "#FF5252",
                    borderRadius: 12,
                    minWidth: 24,
                    height: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onLogout}
              style={{
                padding: 8,
              }}
            >
              <Ionicons name="log-out-outline" size={28} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text
        style={{
          fontSize: 26,
          color: "#dd6e42",
          fontWeight: "bold",
        }}
      >
        {currentUser.accountId}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginTop: 22,
          marginRight: 10,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "#black",
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          Current Balance
        </Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: "#4CAF50",
            borderBottomWidth: 1,
            opacity: 0.25,
            marginBottom: 4,
            marginLeft: 2,
            marginRight: 0,
          }}
        ></View>
        <Text
          style={{
            fontSize: 24,
            color: "#4CAF50",
            fontWeight: "bold",
          }}
        >
          {formatMoney(currentUser.balance)}
        </Text>
      </View>
    </View>
  );
};

export default HeaderView;
