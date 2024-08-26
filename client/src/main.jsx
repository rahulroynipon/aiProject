import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
<<<<<<< HEAD
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Provider from "./components/Provider.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider>
      <App />
    </Provider>
  </QueryClientProvider>
);
=======

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
>>>>>>> 7a6c11d8aa51212c43914995b5451fcdc55dc0d4
