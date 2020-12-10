import React from 'react';
import { TouchableOpacity, Text, Button } from 'react-native';

const MyMatchingItem = (props) => {
  const navigation = props.navigation;
  const { id, homeTeam, date, state, district, countMember, description, matchStatus } = props.myMatching;
  const homeTeam_id = homeTeam.id;
  const name = homeTeam.name;
  const logoPath = homeTeam.logopath;

  return (
    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", margin: 5, justifyContent: "space-between" }}
      onPress={() => {
        navigation.navigate('MatchingDetail',
          { id: id, homeTeam_id: homeTeam_id, name: name, logoPath: logoPath,
            state: state, district: district, date: date, countMember: countMember, description: description, matchStatus: matchStatus });
      }}
    >
      <Text style={{ fontSize: 15, marginLeft: 5 }}>{date}</Text>
      <Text style={{ fontSize: 15, marginLeft: 5 }}>{state} {district}</Text>
      <Text style={{ fontSize: 15, marginLeft: 5 }}>{countMember}</Text>

      <Button title="요청목록" onPress={() => { navigation.navigate('MatchingRequest',
        {id: id});
        }}/>
    </TouchableOpacity>
  );
};

export default MyMatchingItem;