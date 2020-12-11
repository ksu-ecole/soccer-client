import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import MatchingRequestItem from '../components/MatchingRequestItem';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from '../api';

import moment from 'moment';
import 'moment-timezone';
moment.tz.setDefault("Asia/Seoul");

async function getRequest(setRequest, id) {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: token
      }
    }
    const res = await api.get(`/api/matches/home/${id}`, config);
    setRequest(res.data);
    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}

const MatchingRequestScreen = ({ route }) => {
  const { id } = route.params;
  const [ request , setRequest] = useState(null);

  useEffect(() => {
    getRequest(setRequest, id);
  }, [])

  return (
    <>
      {
        request ?
        <>
          {
            <View style={{ flex: 1, padding: 10 }}>
            <FlatList
              data={request.applicationTeamResponses}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <MatchingRequestItem matchingRequest={item} />}
              style={{ margin: 10 }}
            />
            </View>
          }
        </>
        : <Text>Loading...</Text>
      }
    </>

  )
}

export default MatchingRequestScreen;