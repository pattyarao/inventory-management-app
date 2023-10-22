"use client";
import { useAmp } from "next/amp";
import Image from "next/image";
import { useEffect } from "react";
import supabase from "../app/supabase";
import withAuthentication from "../app/auth";
import Navbar from "./components/Navbar";
import Dashboard from "./dashboard/page";

const Home = ({ userType }) => {
  if (!userType) {
    return (
      <div>
        <p>Loading</p>
      </div>
    );
  }
  return (
    <main className="flex flex-col w-full min-h-screen">
      <Navbar userType={userType} />
      <Dashboard role={userType} />
    </main>
  );
};

export default withAuthentication(Home, ["Stock Controller", "Owner"]);
