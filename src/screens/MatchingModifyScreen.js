//날짜 다음달 안됨
//날짜 불러오기 안됨, 수정 됨
//시, 구 불러오기 안됨, 수정 됨
//인원 불러오기, 수정 됨
//세부사항 팀정보가 불러와짐, 팀정보라서 수정 되는지 확인안됨

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, ActivityIndicator } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment';
import LocationItem from '../components/LocationItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api';

async function PutMatching(data, id, navigation) {
  console.log(data);
  console.log(id);
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': token
      }
    }
    const res = await api.put(`/api/matches/${id}`, data, config);
    console.log(res);
    navigation.navigate('MatchingList');
  } catch (err) {
    console.log(err)
  }
}

async function getProfile(setAccount) {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': token
      }
    }
    const res = await api.get('/api/accounts/profile', config);
    setAccount(res.data);
  } catch (err) {
    console.log(err);
  }
}



const MatchingModifyScreen = ({ route, navigation }) => {
  const { id, state, district, countMember, description } = route.params;
  const [showCal, setShowCal] = useState(false);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [location, setLocation] = useState('');
  const [matchingState, setState] = useState(state);
  const [matchingDistrict, setDistrict] = useState(district);
  const [matchingCountMember, setCountMember] = useState(countMember);
  const [matchingDescription, setDescription] = useState(description);
  const [account, setAccount] = useState(null);
console.log(account)
  useEffect(() => {
    getProfile(setAccount);
  }, [])


  return (
    <>
      {
            showCal ?
              <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
                <CalendarList
                  horizontal={true}
                  pagingEnabled={true}
                  futureScrollRange={50}

                  current={moment().format('YYYY-MM-DD')}
                  minDate={moment().format('YYYY-MM-DD')}
                  maxDate={'2020-11-30'}
                  onDayPress={(day) => {
                    setDate(day.dateString);
                    setShowCal(false);
                  }}
                  monthFormat={'yyyy-MM-dd'}
                  hideExtraDays={true}
                  enableSwipeMonths={true}
                  markedDates={{
                    [date]: { selected: true, marked: true, selectedColor: 'blue' }
                  }}
                />
              </View>
              :
              <ScrollView>
                <View style={{ flex: 1, padding: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 30, textAlign: "center" }}>경기 수정</Text>
                  </View>
                  <View style={styles.container}>
                    <Button title="날짜" onPress={() => setShowCal(true)} />
                    <Text style={{ fontSize: 25, textAlign: "center" }}>{date}</Text>
                    <View>
                      <Text style={styles.info}>지역</Text>

                      <LocationItem setLocation={setLocation} />

                    </View>

                    <View>
                      <Text style={styles.info}>인원 수</Text>
                      <TextInput
                        onChangeText={setCountMember}
                        value={matchingCountMember}
                        style={styles.input}
                        placeholderTextColor="grey"
                      />
                    </View>

                    <View>
                      <Text style={styles.info}>세부사항</Text>
                      <TextInput
                        onChangeText={setDescription}
                        value={matchingDescription}
                        style={styles.input}
                        placeholderTextColor="grey"
                        maxLength={200}
                      />
                    </View>
                  </View>

                  <View style={buttonstyles.button}>
                    <Button title="매칭수정하기"
                      onPress={() => {
                        const data = {
                          countMember: matchingCountMember,
                          description: matchingDescription,
                          date: date,
                          ...location
                        }
                        console.log(data)
                        PutMatching(data, id, navigation);
                      }}
                    />
                  </View>
                </View>
              </ScrollView>
      }
    </>
  )

}

export default MatchingModifyScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10
  },
  info: {
    marginTop: 15,
    marginLeft: 8,
    fontSize: 18
  },
  input: {
    margin: 7,
    width: '95%',
    height: 40,
    alignSelf: 'center',
    borderColor: "grey",
    borderWidth: 0.8
  }

})

const buttonstyles = StyleSheet.create({
  button: {
    margin: 30,
    width: '50%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'flex-end'
  }
})