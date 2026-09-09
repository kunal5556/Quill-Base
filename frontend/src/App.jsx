import AuthInitializer from "./components/auth/AuthInitializer";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Layout from "./components/layout/Layout";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ErrorBoundary>
      <AuthInitializer>
        <Layout>
          <AppRoutes />
        </Layout>
      </AuthInitializer>
    </ErrorBoundary>
  );
}

export default App;
