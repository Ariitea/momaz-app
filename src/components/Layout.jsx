import Navigation from "./Navigation";

function Layout({ children }) {
  return (
    <div className="site-frame">
      <Navigation />
      {children}
    </div>
  );
}

export default Layout;
