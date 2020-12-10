import React from 'react';
import { Text, View, Button } from 'react-native';
import { Avatar } from 'react-native-elements';
import { api } from '../api';
import AsyncStorage from "@react-native-async-storage/async-storage";

const RequestMemberItem = (props) => {
  const { id, name, image } = props.requestmember;
  

  async function putRequestMember(teamStatus, id) {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token
        }
      }
      const res = await api.put(`/api/applications/accounts/${id}/team`, teamStatus, config);
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <View style={{ flexDirection: "row", alignItems: "center", margin: 5, justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Avatar size="medium" rounded source={{ uri: image }} containerStyle={{ backgroundColor: "gray" }} />
        <Text style={{ fontSize: 20, marginLeft: 5 }}>{name}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Button title="수락" onPress={() => {
          putRequestMember({teamStatus : "ACCEPT"}, id)
        }} color="#EDD81C" />
        <Button title="거절" onPress={() => {
          putRequestMember({teamStatus : "REJECT"}, id)
        }}
          color="#EDD81C" />
      </View>
    </View>
  );
};

export default RequestMemberItem;