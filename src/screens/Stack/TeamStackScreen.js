import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  TeamDetailScreen,
  TeamCreateScreen,
  TeamListScreen,
 
} from "../";

const TeamStack = createStackNavigator();

export default MypageStackScreen = () => {
  return (
    <TeamStack.Navigator>
      <TeamStack.Screen name="TeamList" component={TeamListScreen} />
      <TeamStack.Screen name="TeamDetail" component={TeamDetailScreen} />
      
      <TeamStack.Screen name="TeamCreate" component={TeamCreateScreen} />
    </TeamStack.Navigator>
  );
}