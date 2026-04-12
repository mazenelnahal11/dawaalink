import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { connectWebSocket, disconnectWebSocket } from './lib/websocket';
import { useAuthStore } from './store/AuthStore';

// Create a client
const queryClient = new QueryClient();

function App() {
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }
  }, [user]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
