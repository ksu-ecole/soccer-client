import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Button } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import MatchingItem from '../components/MatchingItem';
import MyMatchingItem from '../components/MyMatchingItem';
import NoMyMatchingItem from '../components/NoMyMatchingItem';
import AllLocationItem from '../components/AllLocationItem';
import { Avatar } from 'react-native-elements';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import 'moment-timezone';
moment.tz.setDefault("Asia/Seoul");
import { api } from '../api';
import AsyncStorage from "@react-native-async-storage/async-storage";

async function getMatchingList(setMatchings, search, location) {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: token
      }
    }
    const res = await api.get(`/api/matches?teamName=${search}&state=${location.state}&district=${location.district}`, config);
    console.log(`/api/matches?teamName=${search}&state=${location.state}&district=${location.district}`)//
    setMatchings(res.data);
  } catch (error) {
    console.log(error)
  }
}

async function getmyMatchingList(setmyMatchings) {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: token
      }
    }
    const res = await api.get(`/api/matches/homeTeam/matchList`, config);
    setmyMatchings(res.data);
  } catch (error) {
    console.log(error)
  }
}

const MatchingListScreen = ({ navigation }) => {

  const [search, setSearch] = useState('');
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [showCal, setShowCal] = useState(false);
  const [location, setLocation] = useState();
  const [matchings, setMatchings] = useState([]);
  const [myMatchings, setmyMatchings] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false); //toggle
  const toggleSwitch = () => setIsEnabled(previousState => !previousState); //toggle
  
  useEffect(() => {
    getMatchingList(setMatchings, search, location);
  }, [search, location])

  useEffect(() => {
    getmyMatchingList(setmyMatchings);
  })

  return (
    <>
    {
      showCal ?
        <Calendar
          horizontal={true}
          pagingEnabled={true}
          futureScrollRange={50}
          current={moment().format('YYYY-MM-DD')}
          minDate={moment().format('YYYY-MM-DD')}
          maxDate={'2020-11-30'}
          onDayPress={(day) => {
            setDate(day.dateString);
            setShowCal(false);
            console.log('selected day: ', date)
          }}
          monthFormat={'yyyy-MM-dd'}
          hideExtraDays={true}
          markedDates={{
            // '2020-11-12': { startingDay: true, startingDay: true, color: 'skyblue'},
            // '2020-11-13': { endingDay: true, startingDay: true, color: 'skyblue'},
            [date]: { selected: true, marked: true, selectedColor: 'blue' }
          }}
          markingType={'period'}
        />
        :
        isEnabled ?
          <View style={{ flex: 1, padding: 20 }}>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
            <View style={{ alignItems: 'center' }}>
              <Avatar
                size="large"
                // rounded source={{uri: }}
                containerStyle={{ backgroundColor: "gray" }}
              />
              <Text style={{ fontSize: 30 }}> 우리팀 이름 </Text>
            </View>
            {myMatchings.owner ?
              // 팀장이면
              <FlatList
              data={myMatchings.matches}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <MyMatchingItem myMatching={item} navigation={navigation} />}
              style={{ margin: 10 }}
             />              
             :
             // 팀원이면
             <FlatList
             data={myMatchings.matches}
             keyExtractor={(item) => item.id.toString()}
             renderItem={({ item }) => <NoMyMatchingItem NoMyMatching={item} navigation={navigation} />}
             style={{ margin: 10 }}
            />         
            }
          </View>
          :
          <View style={{ flex: 1, padding: 20 }}>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
            <SearchBar
              placeholder="Team Seach"
              onChangeText={setSearch}
              value={search}
              onSubmitEditing={() => console.log('search:' + search)}
              containerStyle={{ backgroundColor: '#DCDCDC' }}
              lightTheme round
              style={{ margin: 5 }}
            />
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
              <AllLocationItem setLocation={setLocation} />
            </View>
            <Button
              title="날짜선택"
              onPress={() => setShowCal(true)}
              color="gray"
            />
            <FlatList
              data={matchings}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <MatchingItem matching={item} navigation={navigation} />}
            />
            <Button
              title="경기개설"
              onPress={() => navigation.navigate('MatchingCreate')}
            />
          </View>

    }


    </>
  )
}

export default MatchingListScreen;