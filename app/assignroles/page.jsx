import AddEmployee from "../components/AddEmployee";
import EmployeeList from "../components/EmployeeList";
import Navbar from "../components/Navbar";

const AssignRoles = () => {
  return (
    <main className="w-full h-full flex flex-col items-center justify-between gap-8 bg-[#F1F3F8]">
      <Navbar userType={"Owner"} />
      <EmployeeList />

      {/* <AddEmployee /> */}
    </main>
  );
};

export default AssignRoles;
