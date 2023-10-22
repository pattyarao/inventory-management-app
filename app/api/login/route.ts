import supabase from "@/app/supabase";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req,res){

    const reqdata  = await req.json()
    console.log(reqdata)

    const { data, error } = await supabase.auth.signInWithPassword({
        email: reqdata.email,
        password: reqdata.password,
      });

      if (error) {
        console.error("Error during login:", error.message);
        return NextResponse.json({grantAccess: "NO"})
      }

    return NextResponse.json({grantAccess: "YES"})

}