"use client";
import { useAmp } from "next/amp";
import Image from "next/image";
import { useEffect } from "react";
import supabase from "../app/supabase";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import withAuthentication from "../app/auth";
import Navbar from "./components/Navbar";
import Dashboard from "./dashboard/page";

const Home = ({ userType, userInfo }) => {
  const router = useRouter();
  if (userType === "Stock Controller") {
    router.push("materialstocklevels")
  } else if (userType === "Owner") {
    router.push("assignroles")
  } else if (userType === "Manufacturing Head") {
    router.push("productofferings")
  } else if (userType === "Sales Person") {
    router.push("recordorders")
  } 

};

export default withAuthentication(Home, ["Stock Controller", "Owner", "Manufacturing Head", "Sales Person"]);
