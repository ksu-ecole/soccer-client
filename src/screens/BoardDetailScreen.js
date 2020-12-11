import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button, Alert, TextInput } from "react-native";
import { ListItem, Avatar } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler';
import CommentsItem from '../components/CommentsItem'
import { api } from '../api';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScrollView } from "react-native-gesture-handler";

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
    console.log("account.id")
    //어딜가나 35
    console.log(res.data)
  } catch (err) {
    console.log(err);
  }
}

async function getMyBoard(setMy) {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: token
      }
    }
    const res = await api.get(`/api/boards/myBoard`, config);
    setMy(res.data);
    // console.log("my[0].writerId----------")
    //어딜가나 35

    // console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}


async function getBoardDetail(setBoards, id) {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: token
      }
    }
    const res = await api.get(`/api/boards/${id}`, config);
    setBoards(res.data);
    // console.log("boards.writerId///boards.name")
    // console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}

async function postComment(data, setContent) {
  try {
    const token = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: token
      }
    }
    const res = await api.post(`/api/comments`, data, config);
    setContent('');
    // console.log(res);
  } catch (error) {
    console.log(error)
  }
}

const BoardDetailScreen = ({ route, navigation }) => {
  const {id} = route.params;
  const myid = 0;
  // const {id, title, content} = route.board;
  const [boards, setBoards] = useState('');
  const [content, setContent] = useState('');
  const [account, setAccount] = useState(null);
  const [my, setMy] = useState(null);

  useEffect(() => {
    getBoardDetail(setBoards, id);
  }, [boards])

  useEffect(() => {
    getProfile(setAccount);
  }, [])
  
  useEffect(() => {
    getMyBoard(setMy);
  }, [])

  //console.log(my[0].id)
  // my.map((item, i) => (
  //   account.id==item[i].id
  //   ? {myid}=myid+1

  //   : <></>
  // ))
  // console.log(myid)

  const deleteButtonAlert = () =>
    Alert.alert(
      "게시물 삭제",
      "작성하신 글을 삭제하시겠습니까?",
      [
        {
          text: "취소",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "확인", onPress: () => navigation.navigate('BoardList')
        }
      ],
      { cancelable: false }
    );

  return (
    <>
      <View style={{ flex: 1, padding: 1 }}>

        {
          boards ?
          account ?
            // my[0].writerId==account.id
            boards.writeId==account.id
            ? 
              <>
                {/* 게시글; 프로필사진 avatar + 이름 title + 시간 subtitle */}
                <View style={styles.writer} >
                  <ListItem bottomDivider>
                    <Avatar rounded source={{ uri: boards.image }} />
                    <ListItem.Content>
                      <ListItem.Title>{boards.name}</ListItem.Title>
                      <ListItem.Subtitle>{boards.createdAt}</ListItem.Subtitle>
                    </ListItem.Content>

                    
                    <View style={styles.udbutton} >
                      <Button
                        title="수정"
                        type="outline"
                        onPress={() => {navigation.navigate('BoardModify', {id: id, title: boards.title, content: boards.content}); 
                          console.log()}}
                      />
                      <Text>   </Text>
                      <Button
                        onPress={deleteButtonAlert}
                        title="삭제"
                        type="outline"
                      />
                    </View>
                  </ListItem>
                </View>

                {/* 게시글; 제목 + 내용 */}
                <View style={styles.content}>
                  <Text style={styles.title}>
                    {boards.title}
                  </Text>
                  <Text>
                    {boards.content}
                  </Text>
                </View>

                {/* 댓글 입력창 */}
                <View style={styles.inputComment}>
                  <TextInput
                    onChangeText={setContent}
                    value={content}
                    style={styles.inputCommentTextbox}
                    multiline={true}
                    placeholderTextColor="grey"
                    placeholder="댓글을 입력하세요."
                  />
                  <Button title="완료" color="gray" onPress={() => {
                    const data = {
                      boardId: id,
                      content: content
                    }
                    postComment(data, setContent);
                  }}>
                  </Button>
                </View>


                {/* 프로필사진 avatar + 이름 title + 시간 subtitle */}
                <View style={{ flex: 1, margin: 10 }}>
                  <FlatList
                    data={boards.comments}
                    keyExtractor={(item) => item.id.toString()} // comment의 id 값 주긴
                    renderItem={({ item }) => <CommentsItem comment={item} navigation={navigation} />}
                    style={{ backgroundColor: 'white' }}
                  />
                </View>

              
              </>
            :
              <>
                {/* 게시글; 프로필사진 avatar + 이름 title + 시간 subtitle */}
                <View style={styles.writer} >
                  <ListItem bottomDivider>
                    <Avatar rounded source={{ uri: boards.image }} />
                    <ListItem.Content>
                      <ListItem.Title>{boards.name}</ListItem.Title>
                      <ListItem.Subtitle>{boards.createdAt}</ListItem.Subtitle>
                    </ListItem.Content>

                    
                  </ListItem>
                </View>

                {/* 게시글; 제목 + 내용 */}
                <View style={styles.content}>
                  <Text style={styles.title}>
                    {boards.title}
                  </Text>
                  <Text>
                    {boards.content}
                  </Text>
                </View>

                {/* 댓글 입력창 */}
                <View style={styles.inputComment}>
                  <TextInput
                    onChangeText={setContent}
                    value={content}
                    style={styles.inputCommentTextbox}
                    multiline={true}
                    placeholderTextColor="grey"
                    placeholder="댓글을 입력하세요."
                  />
                  <Button title="완료" color="gray" onPress={() => {
                    const data = {
                      boardId: id,
                      content: content
                    }
                    postComment(data, setContent);
                  }}>
                  </Button>
                </View>


                {/* 프로필사진 avatar + 이름 title + 시간 subtitle */}
                <View style={{ flex: 1, margin: 10 }}>
                  <FlatList
                    data={boards.comments}
                    keyExtractor={(item) => item.id.toString()} // comment의 id 값 주긴
                    renderItem={({ item }) => <CommentsItem comment={item} navigation={navigation} />}
                    style={{ backgroundColor: 'white' }}
                  />
                </View>
              </>
          : <></>
          : <></>
        }


      </View>
        
    </>
  );
}

const styles = StyleSheet.create({
  udbutton: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  writer: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  content: {
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  commenter: {
    backgroundColor: 'white',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5
  }
});

export default BoardDetailScreen;