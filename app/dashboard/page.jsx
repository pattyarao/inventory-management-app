import { render } from "react-dom";
import ManufacturerHome from "../components/ManufacturerHome";
import OwnerHome from "../components/OwnerHome";
import SalesPersonHome from "../components/SalesPersonHome";
import StockControllerHome from "../components/StockControllerHome";

const Dashboard = ({ role }) => {
  let renderComponent;
  if (role === "Owner") {
    renderComponent = <OwnerHome />;
  } else if (role === "Stock Controller") {
    renderComponent = <StockControllerHome />;
  } else if (role === "Manufacturing Head") {
    renderComponent = <ManufacturerHome />;
  } else if (role === "Sales Person") {
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
