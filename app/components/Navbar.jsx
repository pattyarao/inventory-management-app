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
    <div className="w-full h-fit flex p-4 justify-between items-center bg-[#526D82]">
      <h3>Inventory Management</h3>

      <div>
        {userType === "Owner" ? (
          <Link href="/assignroles">Assign Roles</Link>
        ) : null}
      </div>
      <div className="flex items-center gap-6">
        <p className="bg-[#9DB2BF] p-2 rounded-md">
          Signed in as{" "}
          <span className="font-bold text-[#041C32]">{userType}</span>
        </p>
        <button onClick={logOut}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
