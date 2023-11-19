import React, { useState } from 'react';

function ManualCountUnit() {
  const [showList, setShowList] = useState(false);

  const toggleList = () => {
    setShowList(!showList);
  };

  return (
    <div>
      <button onClick={toggleList}>Select Unit</button>

      {showList && (
        <ul>
          <li>mL</li>
          <li>L</li>
          <li>dL</li>

        </ul>
      )}
    </div>
  );
}

export default ManualCountUnit;