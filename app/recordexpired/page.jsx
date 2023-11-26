'use client'

import withAuthentication from "../auth";
import DiscardedList from "../components/DiscardedList";
import Navbar from "../components/Navbar";

const RecordExpired = ({userType, userInfo}) => {
  if (!userType) {
    return (
      <div>
        <p>Loading</p>
      </div>
    );
  }
  return (
    <div>
      <Navbar userType={userType} email={userInfo.email} />

      <div className="w-full min-h-screen flex flex-col justify-center items-center gap-2" style={{ backgroundColor: '#27374D', color: 'white' }}>
        <div className="w-[80%] px-10 py-4 bg-blue-400 rounded-lg" style={{ backgroundColor: '#526D82', color: 'white' }}>
          <h1 className="font-black text-5xl">Record Discarded Materials</h1>
        </div>
        
          <DiscardedList userID={userInfo.user_id}/>
          
        </div>
    </div>
    
  );
};

export default withAuthentication(RecordExpired, ['Stock Controller'])

// export default RecordExpired;
