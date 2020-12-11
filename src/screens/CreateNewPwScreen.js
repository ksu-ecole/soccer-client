import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, Alert } from 'react-native';
import { api } from '../api';

const diffPW = (setPassword) =>
  Alert.alert(
    "비밀번호 변경 실패",
    `새 비밀번호와 새 비밀번호 확인이 다릅니다.`,
    [
      {
        text: "재입력하기", onPress: () => {
          setPassword({
            oldPW: '',
            newPW: '',
            confirmPW: ''
          });
        }
      }
    ],
    { cancelable: false }
  );


async function ChangePW(data, navigation) {
  delete data.confirmPW;
  console.log(data);

  try {
    const token = await AsyncStorage.getItem("token");
    console.log(token)
    const config = {
      headers: {
        Authorization: token
      },
    }

    await api.put("/api/accounts/password", data, config),
      console.log("비밀번호 변경 성공"),
      navigation.navigate('MyPage')
  } catch (err) {
    console.log("비밀번호 변경 실패");
    console.log(err);
  }
}

const CreateNewPwScreen = ({ navigation }) => {
  const [password, setPassword] = useState({
    oldPW: '',
    newPW: '',
    confirmPW: ''
  })

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 22, textAlign: 'center' }}>새로운 비밀번호로 변경</Text>
      </View>
      <View style={styles.container}>
        <TextInput
          onChangeText={text => setPassword({ ...password, oldPW: text })}
          value={password.oldPW}
          style={styles.input}
          placeholder="  기존 비밀번호 입력"
          placeholderTextColor="grey"
          secureTextEntry
        />
        <TextInput
          onChangeText={text => setPassword({ ...password, newPW: text })}
          value={password.newPW}
          style={styles.input}
          placeholder="  새 비밀번호 입력"
          placeholderTextColor="grey"
          secureTextEntry
        />
        <TextInput
          onChangeText={text => setPassword({ ...password, confirmPW: text })}
          value={password.confirmPW}
          style={styles.input}
          placeholder="  새 비밀번호 확인"
          placeholderTextColor="grey"
          secureTextEntry
        />
        <View style={styles.button}>
          <Button title="완료" color="#EDD81C"
            onPress={() => {
              if (password.newPW === password.confirmPW) {
                ChangePW(password, navigation);
              } else {
                diffPW(setPassword);
              }


            }}
          />
        </View>

      </View>
      <View style={{ flex: 8 }}>
      </View>
    </View>
  )
}


export default CreateNewPwScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10
  },
  input: {
    margin: 7,
    height: 50,
    borderColor: "grey",
    borderWidth: 0.8
  },
  button: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 1,
    marginTop: 15,
  }
})
