import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox, SafeAreaView, StatusBar } from 'react-native';
import BottomNav from './app/navigation/BottomNav';

const Stack = createNativeStackNavigator();

function App() {
  React.useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
  }, [])
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#123c6e' }}>
        <StatusBar backgroundColor="#123c6e" barStyle={'light-content'} />
        <BottomNav />
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default App;