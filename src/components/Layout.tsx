import { Outlet } from "react-router-dom";

import Filters from "@/components/Filters";
import Sidebar from "@/components/Sidebar";

const Layout = () => {

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "250px auto",
      columnGap: "1rem"
    }}
    >
      <div>
        <Filters />
        <Sidebar />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
export default Layout;
