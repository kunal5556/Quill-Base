import AuthInitializer from "./components/auth/AuthInitializer";
import Layout from "./components/layout/Layout";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthInitializer>
      <Layout>
        <AppRoutes />
      </Layout>
    </AuthInitializer>
  );
}

export default App;
