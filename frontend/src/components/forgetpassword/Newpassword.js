import React, { useState } from "react";
import axios from "axios";
const Newpassword = () => {
  const [password, setPassword] = useState("");
  const [confrimPassword, setconfrimPassword] = useState("");
  const [errors, setErrors] = useState(false);
  const [error, setError] = useState(false);
  const data = async () => {
    setError(false);
    setErrors(false);
    try {
      if (password.length === 0 && confrimPassword.length === 0) {
        setErrors(true);
        return false;
      }
      if (password.length < 5) {
        setError(true);
        return false;
      }
      if (password !== confrimPassword) {
        setError(true);
        return false;
      }
      console.log(password);
      console.log(confrimPassword);
      const resp = await axios.post("api/newPassword", { password });
      let data = resp.data;
      console.log(data);
    } catch (error) {}
  };
  return (
    <div>
      <input
        type="password"
        name="password"
        placeholder="New Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br></br>
      <br></br>
      <input
        type="password"
        name="confrimPassword"
        placeholder="Confirm Password"
        value={confrimPassword}
        onChange={e => setconfrimPassword(e.target.value)}
      />
      {error && <div style={{ color: `red` }}>Invalid Password</div>}
      {errors && (
        <div style={{ color: `red` }}>Please fill all the fields.</div>
      )}
      <button type="submit" onClick={() => data()}>
        Change Password
      </button>
    </div>
  );
};
export default Newpassword;
