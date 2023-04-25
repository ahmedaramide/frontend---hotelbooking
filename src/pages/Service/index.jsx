import React, { useState } from "react";

const Services = () => {
  const [myName, setmyName] = useState("Yusuf");

  const handleClick = () => {
    setmyName("Adedeji");
  };

  return (
    <>
      <div>Services is not updated {myName}</div>
      <button onClick={handleClick}>Change name</button>
    </>
  );
};

export default Services;
