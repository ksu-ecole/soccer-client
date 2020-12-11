import React from 'react';
import { TouchableOpacity, Text, View, Button } from 'react-native';
import { Avatar } from 'react-native-elements';
import { api } from '../api';
import AsyncStorage from "@react-native-async-storage/async-storage";

const MatchingRequestItem = (props) => {
  const matchId = props.matchingRequest.match.id;
  const name = props.matchingRequest.applyTeam.name;
  const logopath = props.matchingRequest.applyTeam.logopath;
  const applyTeamId = props.matchingRequest.id;
  const status = props.matchingRequest.match.matchStatus;
  
  async function putRequest(homeStatus, matchId, applyTeamId) {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token
        }
      }
      const res = await api.put(`/api/matches/${matchId}/home/${applyTeamId}`, homeStatus, config);
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", margin: 5, justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Avatar size="medium" rounded source={{ uri: logopath }} containerStyle={{ backgroundColor: "gray" }} />
        <Text style={{ fontSize: 17, marginLeft: 15, fontWeight: 'bold' }}>{name}</Text>
      </View>
     
      {
        status !== "PROGRESSING" ?
          <>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Button style={{ fontSize: 13, padding: 15 }} title="수락" color="#4c75c0"
                onPress={() => { putRequest({ homeStatus: "ACCEPT" }, matchId, applyTeamId) }} />
              <Text>   </Text>
              <Button style={{ fontSize: 13, marginRight: 15 }} title="거절" color="gray"
                onPress={() => { putRequest({ homeStatus: "REJECT" }, matchId, applyTeamId) }} />
            </View>
          </>
          :
          <></>
      }
     
    </TouchableOpacity>
  );
};

export default MatchingRequestItem;