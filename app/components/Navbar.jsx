"use client";

import { useAmp } from "next/amp";
import Image from "next/image";
import { useEffect } from "react";
import supabase from "../supabase";
import withAuthentication from "../auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = ({ userType }) => {
  const router = useRouter();

  const logOut = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/onboarding");
      return;
    } else {
      await supabase.auth.signOut();
      router.push("/onboarding");
    }
  };
  return (
    <div className="w-full h-fit flex p-4 justify-between items-center bg-[#D6E0F0]">
      <div className="w-[35%] flex justify-between items-center">
        <h3 className="text-2xl text-white font-bold bg-[#393B44] p-2 rounded-md">
          Inventory Management
        </h3>
        <div>
          {userType === "Owner" ? (
            <div className="flex gap-4">
              <Link href="/">Home</Link>
              <Link href="/assignroles">Assign Roles</Link>
            </div>
          ) : userType === "Stock Controller" ? (
            <div className="flex gap-4">
              <Link href="/">Home</Link>
              <Link href="/recordpurchases">Record Purchases</Link>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-6">
          <p className="bg-[#8D93AB] p-2 rounded-md">
            Signed in as{" "}
            <span className="font-bold text-[#041C32]">{userType}</span>
          </p>
          <button onClick={logOut}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
