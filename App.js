import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet /* React Native APIs */,
  Text /* React Native Components */,
  View /* React Native Components */,
  TouchableOpacity /* React Native Components */,
  TextInput /* React Native Components */,
  ScrollView /* React Native Components */,
  Alert /* React Native APIs */,
  Platform /* React Native APIs */,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; /* expo SDK */
import { theme } from "./colors";

const STORAGE_KEY = "@toDos"; /* 스토리지 key name */

export default function App() {
  const [working, setWorking] = useState(true); /* 누른 탭 확인 */
  const [text, setText] = useState(""); /* 입력한 text 업데이트 */
  const [toDos, setToDos] = useState({}); /* 투두리스트 */
  useEffect(() => {
    loadToDos();
  }, []); /* 로드 된 투두리스트 기억 */
  const travel = () => setWorking(false); /* 누르지 않은 탭 */
  const work = () => setWorking(true); /* 누른 탭 */
  const onChangeText = (payload) =>
    setText(payload); /* 입력한 text를 payload라는 인자로 받았다 */
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(toSave)
    ); /* 로드한 투두리스트 저장 */
  };

  // toDo 로드
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if (s) {
      setToDos(JSON.parse(s));
    }
  };

  // toDo추가
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    // const newToDos = Object.assign({}, toDos, {[Date.now()]: { text, work: working },
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  // toDo 지우기 : 여기서 인자인 key는 투두리스트 item을 가져온 것이다 id로...
  const deleteToDo = async (key) => {
    if (Platform.OS === "web") {
      const ok = confirm("Do you want to delete this To Do?");
      if (ok) {
        const newToDos = { ...toDos };
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);
      }
    } else {
      Alert.alert("Delete To Do", "Are you sure?", [
        { text: "Canecl" },
        {
          text: "I'm Sure",
          style: "destructive",
          onPress: () => {
            const newToDos = { ...toDos };
            delete newToDos[key];
            setToDos(newToDos);
            saveToDos(newToDos);
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          returnKeyType="done"
          onSubmitEditing={addToDo}
          value={text}
          onChangeText={onChangeText}
          placeholder={working ? "Add a To Do" : "Where do you wnat to go?"}
          style={styles.input}
        />
        <ScrollView>
          {Object.keys(toDos).map((key) =>
            toDos[key].working === working ? (
              <View style={styles.toDo} key={key}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Text style={styles.deleteBtn}>X</Text>
                </TouchableOpacity>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 35,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  deleteBtn: {
    fontSize: 20,
    color: "red",
  },
});

/* 챌린지 */
/* 1. 원래 있었던 탭 저장 */
/* 2. 투두 완료 기능 */
/* 3. text 수정 기능 */
