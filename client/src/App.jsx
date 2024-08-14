import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Render from "./Route";
// Create a QueryClient instance
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Render />
    </QueryClientProvider>
  );
}
