import { render } from "react-dom";
import ManufacturerHome from "../components/ManufacturerHome";
import OwnerHome from "../components/OwnerHome";
import SalesPersonHome from "../components/SalesPersonHome";
import StockControllerHome from "../components/StockControllerHome";

const Dashboard = ({ role }) => {
  let renderComponent;
  if (role === "owner") {
    renderComponent = <OwnerHome />;
  } else if (role === "stockcontroller") {
    renderComponent = <StockControllerHome />;
  } else if (role === "manufacturer") {
    renderComponent = <ManufacturerHome />;
  } else if (role === "salesperson") {
    renderComponent = <SalesPersonHome />;
  } else {
    renderComponent = (
      <div>
        <p>This role does not exist!</p>
      </div>
    );
  }

  return <main>{renderComponent}</main>;
};

export default Dashboard;
