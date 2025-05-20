import {
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { useState, useRef } from 'react';
import { formatMoney } from '../utils/formatUtils';
import AndroidRecipientSelect from './AndroidRecipientSelect';
import IOSRecipientSelect from './IOSRecipientSelect';

const TransferModal = ({
  visible,
  selectedUser, // This is now the current logged-in user
  users, // This is the filtered list of recipients (no bank, no current user)
  onClose,
  onTransfer,
  isTransferring,
}) => {
  const [recipient, setRecipient] = useState(null);
  const [amount, setAmount] = useState('');
  const resetFields = () => {
    setAmount('');
    setRecipient(null);
  };

  const handleTransfer = () => {
    if (!recipient || !amount) {
      Alert.alert('Error', 'Please select a recipient and enter an amount');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (numAmount > selectedUser.balance) {
      Alert.alert('Error', 'Insufficient funds');
      return;
    }

    Promise.resolve(onTransfer(recipient.id, numAmount))
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
  const formatUserName = (user) => {
    if (!user) return <Text>None selected</Text>;
    return (
      <Text>
        {user.firstName} {user.lastName}
      </Text>
    );
  };

  const pickerRef = useRef();
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            // backgroundColor: "rgba(0,0,0,0.5)",
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              marginTop: 60,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderWidth: 3,
              borderColor: '#ccc',
            }}>
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
              }}>
              <Text
                style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
                Transfer Money
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: selectedUser?.balance <= 0 ? '#FF5252' : '#4CAF50',
                  fontWeight: 'bold',
                }}>
                Your Balance: {formatMoney(selectedUser?.balance || 0)}
              </Text>
            </View>

            <ScrollView style={{ flex: 1 }}>
              <View>
                <Text
                  style={{
                    color: '#666',
                    fontSize: 14,
                    marginTop: 20,
                    textAlign: 'center',
                  }}>
                  Please select a recipient and enter an amount
                </Text>
{Platform.OS === 'android' ? (
                  <AndroidRecipientSelect
                    users={users}
                    recipient={recipient}
                    setRecipient={setRecipient}
                  />
                ) : (
                  <IOSRecipientSelect
                    users={users}
                    recipient={recipient}
                    setRecipient={setRecipient}
                  />
                )}

                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    marginHorizontal: 10,
                  }}>
                  Amount:
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#eee',
                    padding: 15,
                    borderRadius: 10,
                    fontSize: 16,
                    backgroundColor: 'white',
                    marginBottom: 20,
                    marginHorizontal: 10,
                  }}
                  placeholder="Enter amount"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 10,
                    marginHorizontal: 10,
                    marginVertical: 10,
                  }}>
                  <Button title="Cancel" onPress={handleClose} color="#666" />

                  <Button
                    title={isTransferring ? 'Processing...' : 'Transfer'}
                    onPress={handleTransfer}
                    disabled={
                      !recipient ||
                      !amount ||
                      isTransferring ||
                      selectedUser?.balance <= 0
                    }
                    color="#4CAF50"
                  />
                </View>

                {selectedUser?.balance <= 0 && (
                  <Text
                    style={{
                      color: '#FF5252',
                      fontSize: 14,
                      marginTop: 10,
                      textAlign: 'center',
                    }}>
                    Insufficient balance to make a transfer
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TransferModal;
