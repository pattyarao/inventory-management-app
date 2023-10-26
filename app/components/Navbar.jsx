"use client";

import { useAmp } from "next/amp";
import Image from "next/image";
import { useEffect } from "react";
import supabase from "../supabase";
import withAuthentication from "../auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { FaUserAlt } from "react-icons/fa";
// import { MdLogout } from "react-icons/md";

const Navbar = ({ userType, email }) => {
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
    <div className="w-full h-fit flex flex-col">
      <div className="w-full flex justify-between items-center bg-[#D6E0F0] p-4">
        <h3 className="text-3xl font-black text-[#393B44] uppercase">
          Inventory Management.
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 bg-[#8D93AB] rounded-md py-2 px-6">
            <div className="bg-[#D6E0F0] p-2 rounded-full">
              {/* <FaUserAlt /> */}
            </div>
            <div className="flex flex-col">
              <p className="font-bold text-sm text-[#041C32]">{email}</p>
              <p className="text-xs">{userType}</p>
            </div>
          </div>

          <button
            onClick={logOut}
            className="flex items-center gap-2 px-4 py-2"
          >
            {" "}
            {/* <MdLogout /> */}
            Logout
          </button>
        </div>
      </div>
      <div className="w-full flex justify-between items-center bg-[#8D93AB] px-4 py-2">
        {userType === "Owner" ? (
          <div className="w-[45%] flex items-center justify-center gap-4 ">
            <Link
              href="/"
              className="w-1/3 text-[white] font-bold hover:bg-black/40 rounded-md py-0.5 px-2 transition ease-in duration-50"
            >
              Home
            </Link>
            <Link
              href="/assignroles"
              className="w-1/3 text-[white] font-bold hover:bg-black/40 rounded-md py-0.5 px-2 transition ease-in duration-50"
            >
              Assign Roles
            </Link>

            <Link
              href="/generatereport"
              className="w-1/3 text-[white] font-bold hover:bg-black/40 rounded-md py-0.5 px-2 transition ease-in duration-50"
            >
              Generate Report
            </Link>
          </div>
        ) : userType === "Stock Controller" ? (
          <div className="w-full flex items-center justify-center gap-4 ">
            <Link
              className="w-[20%] text-[white] font-bold hover:bg-black/40 rounded-md py-0.5 px-2 transition ease-in duration-50"
              href="/"
            >
              Home
            </Link>
            <Link
              className="w-[20%] text-[white] font-bold hover:bg-black/40 rounded-md py-0.5 px-2 transition ease-in duration-50"
              href="/recordpurchases"
            >
              Record Purchases
            </Link>
            <Link
              className="w-[20%] text-[white] font-bold hover:bg-black/40 rounded-md py-0.5 px-2 transition ease-in duration-50"
              href="/recordexpired"
            >
              Record Discarded
            </Link>
            <Link
              className="w-[20%] text-[white] font-bold hover:bg-black/40 rounded-md py-0.5 px-2 transition ease-in duration-50"
              href="/manualcount"
            >
              Perform Manual Count
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
