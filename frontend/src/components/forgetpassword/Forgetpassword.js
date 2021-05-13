import React from "react";
import { useState } from "react";
const Forgetpassword = () => {
  const [email, setEmail] = useState();
  return (
    <div>
      <h4>"Reset Password"</h4>
      <input
        type="email"
        name="email"
        placeholder="Enter email"
        autoComplete="off"
      />
      <p>We'll never share your email with anyone else.</p>
      <button type="submit">Send Login Link </button>
    </div>
  );
};
export default Forgetpassword;
