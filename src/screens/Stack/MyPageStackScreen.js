import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  MyPageScreen,
  EditMyInformation,
  EditTeamInformation,
  CreateNewPwScreen,
  MyTeamDetailScreen,
  TeamMemberScreen
} from "../";

const MyPageStack = createStackNavigator();

export default MypageStackScreen = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen name="MyPage" component={MyPageScreen} />
      <MyPageStack.Screen name="EditMyInformation" component={EditMyInformation} />
      <MyPageStack.Screen name="EditTeamInformation" component={EditTeamInformation} />
      <MyPageStack.Screen name="CreateNewPw" component={CreateNewPwScreen} />
      <MyPageStack.Screen name="MyTeamDetailScreen" component={MyTeamDetailScreen} />
      <MyPageStack.Screen name="TeamMember" component={TeamMemberScreen} />
    </MyPageStack.Navigator>
  );
}