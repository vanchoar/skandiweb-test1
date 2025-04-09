import ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App.tsx";

const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
