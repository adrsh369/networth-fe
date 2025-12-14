import { useEffect, useState } from 'react';
import StackNavigator from './navigation/StackNavigator';
import { initDB } from './database/db';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = async () => {
      await initDB();
      setReady(true);
    };
    start();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <StackNavigator />;
}
