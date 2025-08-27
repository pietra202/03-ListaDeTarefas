import { StatusBar } from "expo-status-bar";
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function App() {
  const [task, setTask] = useState([]);
  const [newtask, setNewtask] = useState("");
  const [darkMode, setDarkMode] = useState(false); // 🌙 controle do tema

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem("tasks");
        savedTasks && setTask(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("tasks", JSON.stringify(task));
      } catch (error) {
        console.error("Erro ao salvar tarefas", error);
      }
    };

    saveTasks();
  }, [task]);

  const addtask = () => {
    if (newtask.trim().length > 0) {
      setTask((prevtask) => [
        ...prevtask,
        {
          id: Date.now().toString(),
          text: newtask.trim(),
          completed: false,
        },
      ]);
      setNewtask("");
      Keyboard.dismiss();
    } else {
      Alert.alert("Atenção", "Por favor informe uma tarefa");
    }
  };

  const toggleCompleteted = (id) => {
    setTask((prevTask) =>
      prevTask.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    Alert.alert(
      "confirmar exclusão",
      "Tem certeza que deseja excluir essa tarefa?",
      [
        { text: "cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () =>
            setTask((prev) => prev.filter((task) => task.id !== id)),
        },
      ]
    );
  };

  const renderList = ({ item }) => (
    <View
      style={[
        styles.taskItem,
        { backgroundColor: darkMode ? "#333" : "#fff" },
      ]}
      key={item.id}
    >
      <TouchableOpacity
        style={styles.taskTextContainer}
        onPress={() => toggleCompleteted(item.id)}
      >
        <Text
          style={[
            styles.taskText,
            { color: darkMode ? "#eee" : "#333" },
            item.completed && styles.completedTaskItem,
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Text style={{ fontSize: 18 }}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#121212" : "#e0f7fa" },
      ]}
    >
      <View
        style={[
          styles.topBar,
          { backgroundColor: darkMode ? "#1e1e1e" : "#fff" },
        ]}
      >
        <Text
          style={[
            styles.topBarTittle,
            { color: darkMode ? "#fff" : "#051650" },
          ]}
        >
          Minhas Tarefas
        </Text>
        <TouchableOpacity onPress={() => setDarkMode(!darkMode)}>
          <Text style={{ fontSize: 22 }}>
            {darkMode ? "☀️" : "🌙"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* campo de adicionar tarefas */}
      <View
        style={[
          styles.card,
          { backgroundColor: darkMode ? "#222" : "#fff" },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: darkMode ? "#333" : "#fcfcfc",
              color: darkMode ? "#eee" : "#333",
            },
          ]}
          placeholder="Adicionar nova tarefa..."
          placeholderTextColor={darkMode ? "#aaa" : "#777"}
          value={newtask}
          onChangeText={setNewtask}
          onSubmitEditing={addtask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addtask}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.flatList}
        data={task}
        keyExtractor={(item) => item.id}
        renderItem={renderList}
        ListEmptyComponent={() => (
          <Text
            style={[
              styles.emptyListText,
              { color: darkMode ? "#bbb" : "#9e9e9e" },
            ]}
          >
            Nenhuma tarefa adicionada ainda
          </Text>
        )}
        contentContainerStyle={styles.flatListContent}
      />
      <StatusBar style={darkMode ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0, 0.1)",
  },
  topBarTittle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    shadowColor: "#000",
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  input: {
    borderColor: "#b0bec5",
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    fontSize: 18,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#123499",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  flatListContent: {
    paddingBottom: 10,
  },
  taskItem: {
    borderColor: "rgba(0,0,0, 0.1)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
  },
  taskTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  taskText: {
    fontSize: 18,
    flexWrap: "wrap",
  },
  completedTaskItem: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
