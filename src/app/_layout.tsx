import "../global.css";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/contexts/authContext";

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

export default function Layout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>          
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                animationDuration: 300,
              }}
            />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </AuthProvider>
  );
}
