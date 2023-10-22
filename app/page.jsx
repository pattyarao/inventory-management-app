"use client";
import { useAmp } from "next/amp";
import Image from "next/image";
import { useEffect } from "react";
import supabase from "../app/supabase";
import withAuthentication from "../app/auth";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import Dashboard from "./dashboard/page";
// export default function Home() {

//   const testFunc = async () => {

//     const { data: { user }, error } = await supabase.auth.getUser()
//     if (error) {
//       console.error("Error signing up:", error.message);
//       return;
//     }
//     console.log(user)
//     console.log(user.id)

//     const { data: userTypeData, error: userTypeError } = await supabase
//     .from('MD_PROFILES')
//     .select()
//     .eq('id', user.id);

//     const { data: userTypeDataInt, error: userTypeIntError } = await supabase
//     .from('REF_USERTYPE')
//     .select()
//     .eq('id', userTypeData[0].user_type);

//   console.log(userTypeData[0])
//   // console.log(userTypeDataInt)
//   console.log("USER TYPE OF ", userTypeData[0].first_name, " is ", userTypeDataInt[0].description)

//   if (userTypeError) {
//     console.error("Error querying user type:", userTypeError.message);
//     return;
//   }

// }

//   useEffect(() => {
//     testFunc()
//   }, [])

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       this is the home page.
//     </main>
//   );
// }

const Home = ({ userType }) => {
  return (
    <main className="flex flex-col w-full min-h-screen">
      <Navbar userType={userType} />
      <Dashboard role={userType} />
    </main>
  );
};

export default withAuthentication(Home, ["Stock Controller", "Owner"]);
