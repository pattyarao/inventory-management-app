import { useAmp } from "next/amp";
import Image from "next/image";
import { useEffect } from "react";
import supabase from "../supabase";
import withAuthentication from "../auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Import the required icons, e.g., FaUserAlt and MdLogout

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
    <div className="w-full h-fit flex flex-col">
      <div className="w-full flex justify-between items-center bg-[#D6E0F0] p-4">
        <h3 className="text-3xl font-black text-[#393B44] uppercase">
          Inventory Management
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 bg-[#8D93AB] rounded-md py-2 px-6">
            {/* Render appropriate component here */}
            {userType === "Stock Controller" ? (
              <div className="flex gap-4">
                <Link href="/">Home</Link>
                <Link href="/recordpurchases">Record Purchases</Link>
                <Link href="/recordexpired">Record Discarded Material</Link>
              </div>
            ) : null}
          </div>

          <button onClick={logOut} className="flex items-center gap-2 px-4 py-2">
            {/* Render the Logout component or button here */}
            Logout
          </button>
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