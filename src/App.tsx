import { Outlet } from "react-router-dom";
import Layout from "./layout/Layout";

const App = () => {
  return (
    //@ts-ignore
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default App;
