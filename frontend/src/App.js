import { StyleSheet } from 'react-native';
import RootNav from './navigation/RootNav';

export default function App() {

  return (
    <RootNav />
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
