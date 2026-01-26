import { Outlet } from "react-router-dom";
import Layout from "./Layout.tsx";

const App = () => {
  return (
    //@ts-ignore
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default App;
