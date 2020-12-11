import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, Button, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { api } from '../api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import mime from "mime";

async function putTeam(id, data, logopath, navigation) {
  const formData = new FormData();
  formData.append("logopath", {
    name: `${id}_profile.jpg`,
    type: mime.getType(logopath.uri),
    uri:
      Platform.OS === "android" ? logopath.uri : logopath.uri.replace("file://", "")
  });
  formData.append("data", JSON.stringify(data));
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': token,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    }
    const res = await api.put(`/api/teams/${id}`, formData, config);
    console.log(res);
    navigation.navigate('MyTeamDetailScreen', {
      screen: 'EditTeamInformation',

    }); 
  } catch (err) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    console.log(err);
  }
}



const EditTeamInformation = ({ route, navigation }) => {
  const {id, logopath, name, description} = route.params.team;
  const [_logopath, setlogopath] = useState({ uri: logopath, type: 'logopath' });
  const [t_description, setDescription] = useState(description);
  
  

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setlogopath(result);
    }
  };

  
  return (
    <ScrollView>
      <View >
        <Text style={styles.title}>{}</Text>

      </View>
      <View >
        <Text style={styles.info}>팀 대표 사진</Text>
        {_logopath && <Image source={{ uri: _logopath.uri }} style={{ width: 200, height: 200 }} />}
        <View style={styles.button1}>
          <Button
            title="찾아보기"
            onPress={pickImage}

          />
        </View>
        <Text style={styles.info}>팀 설명</Text>


        <TextInput
          onChangeText={setDescription}
          value={t_description}
          style={styles.inputlong}
          multiline={true}
          autoCapitalize="none"
        />



      </View>
      <View style={styles.button}>
        <Button
          onPress={() => {
            const data = {
              description: t_description
            };
            putTeam(id, data, _logopath, navigation);
            
          }}
          title="저장하기"
        />
        <Text></Text>
  

      </View>


    </ScrollView>
  )

}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 15
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
  },

  inputlong: {
    margin: 7,
    width: '95%',
    height: 120,
    alignSelf: 'center',
    borderColor: "grey",
    borderWidth: 0.8,
    textAlignVertical: 'top'

  },

  button: {
    margin: 50,
    width: '50%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'flex-end'
  },

  image: {
    margin: 10,
    height: 160,
    width: 160,
    borderWidth: 0.5,
    borderColor: "black"

  },

  button1: {
    marginLeft: 10,
    width: '39%',
    height: 40,
    justifyContent: 'flex-end'
  },


});

export default EditTeamInformation;