"use client";
import { useRouter } from 'next/navigation';
import Navbar from "../components/Navbar";
import withAuthentication from "../auth";
import DetailedTable from "../components/DetailedTable";


const Table = ({ userType, userInfo }) => {
    const router = useRouter();
    const { reportData, reportType, choice } = router.query;
  return (
    <div className="w-full h-full flex flex-col items-center justify-between gap-8 bg-[#F1F3F8]">
      <Navbar userType={userType} email={userInfo.email} />
      <DetailedTable
        reportData={JSON.parse(reportData || '[]')}
        reportType={reportType}
        choice={parseInt(choice)}
      />
      
    </div>
  );
};

export default withAuthentication(Table, [
  "Owner",
  "Stock Controller",
  "Manufacturing Head",
  "Sales Person",
]);
