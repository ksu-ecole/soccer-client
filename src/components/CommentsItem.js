import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, Alert, TextInput, Modal } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { api } from '../api';
import AsyncStorage from "@react-native-async-storage/async-storage";

const CommentsItem = (props) => {
  const { id, name, image, title, createdAt, content, modifiedAt} = props.comment;
  const deleteButtonAlert = () =>
    Alert.alert(
      "댓글 삭제",
      '댓글을 삭제하시겠습니까?',
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "삭제", onPress: () => {
            console.log("댓글 삭제")
            deleteComment()
          }
        }
      ],
      { cancelable: false}

    );

  
  async function deleteComment() {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token
        }
      }
      const res = await api.delete(`/api/comments/${id}`, config);
      console.log(res);
    }catch (error) {
      console.log(error)
    }

    }
  

  async function putComment(data) {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token
        }
      }
      const res = await api.put(`/api/comments/${id}`, data, config);
      inputContent('');
      console.log(res);
    } catch (error) {
      console.log(error)
    }
  }

const [modifyContent, setModifyContent] = useState("");
const [modalVisible, setModalVisible] = useState(false);
const [modicontent, inputContent] = useState('');
  
  return (
    <View style={styles.commenter}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        
      >

          <View style={styles.modalView}>
            <View>
              <TextInput
                onChangeText={inputContent}
                value={modicontent}
                multiline={true}
                placeholderTextColor="grey"
                placeholder="댓글을 입력하세요."
            />
            <Button title="완료" color="gray" onPress={() => {
              const data = {
                content: modicontent
              }
              setModalVisible(!modalVisible);
              putComment(data);
              }}>
            </Button>
            </View>
          </View>
      </Modal>
      
      <ListItem bottomDivider style={styles.commenter}>
        <Avatar rounded source={{ uri: image }} />
        <ListItem.Content>
          <ListItem.Title>{name}</ListItem.Title>
          <ListItem.Subtitle>{createdAt}</ListItem.Subtitle>
        </ListItem.Content>

        <View style={styles.udbutton} >
          <Button
            title="수정"
            type="outline"
            onPress={() => {
              setModalVisible(true);
            }}
          />
          <Text>   </Text>
          <Button
            onPress={deleteButtonAlert}
            title="삭제"
            type="outline"
          />
        </View>
      </ListItem>

      {/* 댓글; 제목 + 내용 */}
      <View style={styles.content}>
        <Text style>
          {content}
        </Text>
      </View>

      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}
      />
    </View>
  );
};

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
    padding: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  commenter: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 5,
    marginBottom: 5
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  }
});

export default CommentsItem;