import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // Import SafeAreaProvider
import MyStack from './Source/Navigation/StackNavigation';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <MyStack />
    </SafeAreaProvider>
  );
};

export default App;
