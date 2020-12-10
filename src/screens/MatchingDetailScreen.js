//내팀이 신청한 매칭의 목록(applystatus), 신청(applyMatch), 취소(cancelMatch) 안됨

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from "react";
import { Text, Image, View, StyleSheet, Button, Alert } from "react-native";
import { ListItem, Icon } from 'react-native-elements'
import { ScrollView } from "react-native-gesture-handler";
import { api } from '../api';

async function getProfile(setAccount) {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        Authorization: token
      }
    }
    const res = await api.get('/api/accounts/profile', config);
    setAccount(res.data);
  } catch (err) {
    console.log(err);
  }
}

async function deleteMatch(id) {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        Authorization: token
      }
    }
    const res = await api.delete(`/api/matches/${id}`, config);
  } catch (err) {
    console.log(err);
  }
}

//id값 팀이 매칭신청한 경기목록
async function applystatus(data, id) { //teamId
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: token
      } 
    }
    const res = await api.get(`/api/applications/teams/away/${id}`, config);
    setUserinfo(res.data); 
    console.log("applystatus" + res.data)
    console.log("id" + id)
  } catch (error) {
    console.log(error)
  }
}

async function applyMatch(setApplication, data, id) { //matchId
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
          Authorization: token
      }
    }
    const res = await api.put(`/api/applications/teams/apply/${id}`, data, config);
    setApplication(res.data);
  } catch (err) {
    console.log(err);
  }
}

async function cancelMatch(applicationId) {
  try {
    console.log("1");
    const token = await AsyncStorage.getItem('token');
    console.log("2");
    const config = {
      headers: {
          Authorization: token
      }
    }
    console.log("3");
    const res = await api.put(`/api/applications/teams/${applicationId}/away`, config);
    console.log("4");
  } catch (err) {
      console.log(err);
  }
}

const MatchingDetailScreen = ({ route, navigation }) => {
  const { id, homeTeam_id, name, logoPath, state, district, date, countMember, description, matchStatus } = route.params; //id=matchingid
  const [account, setAccount] = useState(null);
  const [application, setApplication] = useState();

  useEffect(() => {
    getProfile(setAccount);
  }, [])

  console.log(application)
  
  const list = [
    {
      title: '시간',
      icon: 'event',
      text: date
    },
    {
      title: '장소',
      icon: 'room',
      text: state + district
    },
    {
      title: '인원',
      icon: 'group',
      text: countMember
    },
    {
      title: '설명',
      icon: 'info',
      text: description
    }
  ]

  const deleteButtonAlert = () =>
    Alert.alert(
      "매칭 삭제",
      "매칭 진행중인 경기를 삭제하시겠습니까?",
      [
        {
          text: "취소",
          onPress: () => console.log("매칭 삭제 취소"),
          style: "cancel"
        },
        { text: "확인", onPress: () => {
          console.log("매칭 삭제 완료")
          deleteMatch(id)
          navigation.navigate('MatchingList')
          }
        }
      ],
      { cancelable: false }
    );
    

  const requestButtonAlert = () =>
    Alert.alert(
      "매칭 신청",
      "해당 경기에 매칭을 신청하시겠습니까?",
      [
        {
          text: "취소",
          onPress: () => console.log("매칭 신청 취소"),
          style: "cancel"
        },
        { text: "확인", onPress: () => {
            console.log("매칭 신청 완료")
            const data = {
              awayTeamId: account.team.id
            } 
            applyMatch(setApplication, data, id)
          }
        }
      ],
      { cancelable: false }
    );

  const cancelButtonAlert = () =>
    Alert.alert(
      "매칭 취소",
      "해당 경기에 매칭을 취소하시겠습니까?",
      [
        {
          text: "취소",
          onPress: () => console.log("매칭 신청 유지"),
          style: "cancel"
        },
        { text: "확인", onPress: () => {
          console.log("app: " + application.id)
          console.log("매칭 신청 취소 완료")
          cancelMatch(application.id)
        } 
      }
      ],
      { cancelable: false }
    );
    

  return (
    <ScrollView style={styles.background}>
      {/* 팀로고(이미지) + 팀이름(텍스트) */}
      <View style={styles.teamprofile}>
        <Image source={{ uri: logoPath }} style={{ width: 100, height: 100, borderRadius: 150 / 2 }}
        />
        <View style={{ flexDirection: 'column' }}>
          <Text styles={styles.teamname} style={{ fontSize: 20 }}>{name}</Text>
        </View>
      </View>
      {
        account ?
        account.owner === false
        ?
        <>
          {/* 상세내용 */}
          <View >
            {
              list.map((item, i) => (
                <ListItem key={i} bottomDivider>
                  <Icon name={item.icon} />
                  <ListItem.Content>
                    <ListItem.Title >{item.title}</ListItem.Title>
                    <ListItem.Subtitle >{item.text}</ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              ))
            }
          </View>
        </>
        :
        <>
          {
            account.team.name === name
            ?
            <>
              {/* 수정/삭제 버튼 */}
              <Button
              onPress={() => {
                navigation.navigate('MatchingModify',
                    {
                      id: id, homeTeam_id: homeTeam_id, name: name, logoPath: logoPath, state: state, district: district,
                      date: date, countMember: countMember, description: description, matchStatus: matchStatus
                    });
              }}
              title="매칭 수정"
              color="gray"
              type="outline"
              />
              <Button
                onPress=
                //{() => {
                  {deleteButtonAlert}
                  //deleteMatch(id)
                  //navigation.navigate('MatchingList')
                //}}
                title="매칭 삭제"
                color="#de3143"
                type="outline"
              />

              {/* 상세내용 */}
              <View >
                {
                  list.map((item, i) => (
                    <ListItem key={i} bottomDivider>
                      <Icon name={item.icon} />
                      <ListItem.Content>
                        <ListItem.Title >{item.title}</ListItem.Title>
                        <ListItem.Subtitle >{item.text}</ListItem.Subtitle>
                      </ListItem.Content>
                    </ListItem>
                  ))
                }
              </View>
            </>
            :
            <>
              {/* 신청/취소 버튼 */}
              <View style={styles.oxbutton}>
              
                <Button
                onPress={requestButtonAlert}
                title="누르지마 신청"
                />
                
                <Button
                onPress={cancelButtonAlert}
                title="누르지마 취소"
                />
              </View>

              {/* 상세내용 */}
              <View >
                {
                  list.map((item, i) => (
                    <ListItem key={i} bottomDivider>
                      <Icon name={item.icon} />
                      <ListItem.Content>
                        <ListItem.Title >{item.title}</ListItem.Title>
                        <ListItem.Subtitle >{item.text}</ListItem.Subtitle>
                      </ListItem.Content>
                    </ListItem>
                  ))
                }
              </View>
            </>
          }
        </>
        :<></>
      }
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  background: {
    margin: 30
  },
  teamprofile: {
    margin: 20,
    alignItems: 'center'
  },
  teamname: {
    marginLeft: 10,
    alignContent: 'center',
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center'
  },
  udbutton: {
    flexDirection: 'row',
    position: 'absolute',
    top: 20,
    right: 20
  },
  oxbutton: {
    marginTop: 30,
    marginBottom: 30
  }
});

export default MatchingDetailScreen;