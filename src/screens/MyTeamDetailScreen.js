//마이페이지 - 팀상세

import React, { useEffect, useState } from 'react';
import { Text, Image, View, StyleSheet, Alert, } from "react-native";
import { Button, ListItem, Icon } from 'react-native-elements';
import { ScrollView } from "react-native-gesture-handler";
import { api } from '../api';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from '@react-navigation/native';


async function DeleteTeam(id, navigation) {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': token,
      }
    }
    const res = await api.delete(`/api/teams/${id}`, config);
    console.log(res);
    navigation.navigate('MyPage', {
      screen: 'MyPage',

    });
  } catch (err) {
    console.log(err);
  }
}


async function withdrawal(data, navigation) {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': token,
      }
    }
    const res = await api.put(`/api/accounts/withdrawal`, data, config);
    console.log(res);
    navigation.navigate('MyPage', {
      screen: 'MyTeamDetailScreen',

    });
  } catch (err) {
    console.log(err);
  }
}


// import Icon from 'react-native-vector-icons/FontAwesome';

// async function getTeam(setTeam, teamId) {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     const config = {
//       headers: {
//         'Authorization': token
//       }
//     }
//     const res = await api.get(`/api/teams/${teamId}`, config);
//     setTeam(res.data);
//     console.log(res.data);
//   } catch (err) {
//     console.log(err);
//   }
// }

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
    // console.log(res.data);
  } catch (err) {
    console.log(err);
  }
}


const MyTeamDetailScreen = ({ route, navigation }) => {
  //const { id, team } = route.params.params;
  const teamId = route.params;
  const [account, setAccount] = useState(null);
  const isFocused = useIsFocused();
  // useEffect(() => {
  //   getTeam(setTeam, teamId);
  // }, [isFocused])

  useEffect(() => {
    getProfile(setAccount);
  }, [isFocused])

  // const exitButtonAlert = () =>
  //   Alert.alert(
  //     "팀 탈퇴",
  //     `팀을 탈퇴하시겠습니까?`,
  //     [
  //       {
  //         text: "취소",
  //         onPress: () => console.log("팀 탈퇴 취소"),
  //         style: "cancel"
  //       },
  //       {
  //         text: "확인", onPress: () => {
  //           const data = {
  //             description: t_description
  //           };
  //           console.log("팀 탈퇴 성공")
  //           navigation.navigate('MyPage');
  //         }
  //       }
  //     ],
  //     { cancelable: false }
  //   );

  return (
    <>
      {console.log(route.params)}
        {account ?
          account.team === null ?
          <View>
            <Button
                onPress={() => {
                  
                  navigation.navigate('MyPage',
                    );
                }}

                title="팀이 없습니다 (돌아 가기)"
                type="outline"

              />

          </View>
          :
          <ScrollView style={styles.background}>
            <View style={styles.teamprofile}>
              <Image source={{ uri: account.team.logopath }} style={{ width: 100, height: 100, borderRadius: 150 / 2 }} />
              <View style={{ flexDirection: 'column' }}>
                <Text styles={styles.teamname} style={{ fontSize: 20 }}>{account.team.name}</Text>
              </View>
            </View>

            <View>
              {account.owner ?
                <Button
                  onPress={() => {
                    navigation.navigate('EditTeamInformation', {team : account.team })
                  }}
                  title="팀 정보 수정"
                />
                : <Text></Text>
              }
              <View style={{ marginBottom: 30 }}>
                <ListItem bottomDivider>
                  <Icon name='room' />
                  <ListItem.Content>
                    <ListItem.Title >지역</ListItem.Title>
                    <ListItem.Subtitle >{account.team.state} {account.team.district}</ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                  <Icon name='info' />
                  <ListItem.Content>
                    <ListItem.Title >설명</ListItem.Title>
                    <ListItem.Subtitle >{account.team.description}</ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              </View>
            </View>


            <View style={{ marginBottom: 30 }}>
              <Button
                onPress={() => {
                  console.log(account.team.id, account.id)
                  navigation.navigate('TeamMember',
                    { id: account.team.id, memberId: account.id });
                }}

                title="팀원 목록"
                type="outline"

              />
            </View>


            <View>
              {account.owner ?
                <Text></Text>
                :
                <Button
                  onPress={() => {
                    Alert.alert(
                      "팀 탈퇴",
                      `팀을 탈퇴하시겠습니까?`,
                      [
                        {
                          text: "취소",
                          onPress: () => console.log("팀 탈퇴 취소"),
                          style: "cancel"
                        },
                        {
                          text: "확인", onPress: () => {
                            {
                              
                              withdrawal( navigation);

                              console.log("팀 탈퇴 성공")
                              navigation.navigate('MyPage');
                            }
                          }
                        }
                      ],
                      { cancelable: false }
                    );

                  }}
                  title="팀 탈퇴"
                />
              }

              {account.owner ?
                <Button
                  onPress={() => {
                    Alert.alert(
                      "팀 해체",
                      `팀을 해체하시겠습니까?`,
                      [
                        {
                          text: "취소",
                          onPress: () => console.log("팀 해체 취소"),
                          style: "cancel"
                        },
                        {
                          text: "확인", onPress: () => {
                            {

                              const id = account.team.id;
                              console.log(id);
                              DeleteTeam(id, navigation);

                              console.log("팀 해체 성공")
                              navigation.navigate('MyPage');
                            }
                          }
                        }
                      ],
                      { cancelable: false }
                    );

                  }}
                  title="팀 해체"
                />
                :
                <Text></Text>

              }
            </View>

          </ScrollView>
          :
          <Text>Loading...</Text>
      }
    </>


  );
}


const styles = StyleSheet.create({
  background: {
    margin: 30
  },
  image: {
    height: 160,
    width: 160,
    borderWidth: 0.5,
    borderColor: "black",
    marginTop: 30
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
  oxbutton: {
    marginTop: 30,
    marginBottom: 30
  }
});

export default MyTeamDetailScreen;