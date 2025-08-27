import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.container}>
      <Text styles={styles.toBarTitle}>Minhas tarefas</Text>
      <TouchableOpacity>
        <Text>🌖</Text>
      </TouchableOpacity>
    </View>

    <View>
    <TextInput
    style={styles.input}
    placeholder="Adicionar nova tarefa..."
    />
    <TouchableOpacity style={styles.addButton}>
      <Text style={styles.buttonText}>Adicionar</Text>
    </TouchableOpacity>
    </View>

    {/* lista de tarefas do usuario*/}

    <FlatList
      style={styles.FlatList}
      ListEmptyComponent={() => (
      <Text style={styles.emptyListText}>Nenhuma tarefa adicionada adicionada
      </Text>
  )}
  contentContainerStyle={styles.flatListContent}
  />
    <StatusBar style="auto" />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
