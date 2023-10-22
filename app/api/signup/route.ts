import supabase from "@/app/supabase";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req,res){
    try {

        const reqdata  = await req.json()
        console.log(reqdata)

        //CREATE USER
        const { data, error } = await supabase.auth.admin.createUser({
          email: reqdata.email,
          password: reqdata.password,
          email_confirm: true
        })

        if (error) {
          console.error("Error signing up:", error.message);
          return NextResponse.json(error.message)
        }

        const USER_ID =  data.user.id
        console.log("USER ID CHECK: " + USER_ID)
       
          console.log("SELECTED ROLE: " + reqdata.selectedRole)
          // Query the REF_USERTYPE table to get the key for the selected role
          const { data: userTypeData, error: userTypeError } = await supabase
          .from('REF_USERTYPE')
          .select()
          .eq('description', reqdata.selectedRole);

        console.log(userTypeData[0].id)

        if (userTypeError) {
          console.error("Error querying user type:", userTypeError.message);
          return NextResponse.json(userTypeError.message)
        }

        // Create a user profile in MD_PROFILES
      const profileData = {
        id: data.user.id,
        first_name: reqdata.firstName,
        last_name: reqdata.lastName,
        user_type: userTypeData[0].id, // Use the key from REF_USERTYPE
        status: "FALSE"
      };

      console.log(profileData)

        const { data: profile, error: profileError } = await supabase
          .from("MD_PROFILES")
          .upsert([profileData]);

        if (profileError) {
          console.error("Error creating user profile:", profileError.message);
          return NextResponse.json(profileError.message)
          return;
        }

        // Form submitted successfully
        console.log("Form submitted with data:", profileData);
        return NextResponse.json("Success")
      } catch (error) {
        console.error("Error during signup:", error.message);
        return NextResponse.json(error.message)
      }


}