import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="app-main container py-4">{children}</main>

      <Footer />
    </div>
  );
}

export default Layout;
