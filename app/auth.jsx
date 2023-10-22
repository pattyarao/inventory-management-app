// authHOC.js
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../app/supabase';
import { useState } from "react";


const withAuthentication = (WrappedComponent, allowedUserTypes) => {
    


  return function WithAuthentication(props) {
    const router = useRouter();
    const [currUserType, setCurrUserType] = useState("");
    const [userInfo, setUserInfo] = useState({
      email: "",
      first_name: "",
      last_name: "",
      user_id: "",
    });
    const checkValidation = async () => { 
    

        const { data: { user }, error } = await supabase.auth.getUser()

        if(!user){
            router.push('/onboarding');
            return;
        }

        if (error) {
          console.error("Error signing up:", error.message);
          return;
        }

        const { data: userTypeData, error: userTypeError } = await supabase
        .from('MD_PROFILES')
        .select()
        .eq('id', user.id);

        if (userTypeError) {
            console.error("Error querying user type:", userTypeError.message);
            return;
          }
    
        const { data: userTypeDataValue, error: userTypeValueError } = await supabase
        .from('REF_USERTYPE')
        .select()
        .eq('id', userTypeData[0].user_type);

        if (userTypeValueError) {
            console.error("Error querying user type value:", userTypeValueError.message);
            return;
          }
        
        

        console.log(userTypeDataValue[0].description)

        setUserInfo({
          email: user.email,
          first_name: userTypeData[0].first_name,
          last_name: userTypeData[0].last_name,
          user_id: user.id,
        });

        setCurrUserType(userTypeDataValue[0].description)
    
        if (!allowedUserTypes.includes(userTypeDataValue[0].description)) {
        router.push('/onboarding');
        return;
         }


      
    }
    
      useEffect(() => { 
        checkValidation()
      }, [])

      useEffect(() => {
        console.log(currUserType);
        console.log(userInfo)
      }, [currUserType]);



    return <WrappedComponent {...props} userType={currUserType} userInfo={userInfo}/>;
  };
};

export default withAuthentication;
