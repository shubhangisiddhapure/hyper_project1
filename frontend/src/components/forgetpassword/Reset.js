import React, { useState } from "react";
import axios from "axios";
import "./reset.css";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const Postdata = async () => {
    setError(false);
    try {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      console.log(email);
      if (!pattern.test(email)) {
        setError(true);
        return false;
      }
      const resp = await axios.post("api/resetPassword", { email });
      let data = resp.data;
      if (data) {
        alert("Please Check your email to reset password");
        return true;
      }
    } catch (error) {
      setError(true);
    }
  };
  return (
    <div className="resetpage">
      <div className="resetbox">
        <h2>Reset Password</h2>
        <div className="resetcontainer">
          Enter your email and we'll send you a link to get back into your
          account.
        </div>
        <input
          type="email"
          className="emailbox"
          name="email"
          placeholder="Enter email"
          autoComplete="off"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />{" "}
        {error && <div style={{ color: `red` }}>Invalid Email</div>}
        <div className="resetcontainer">
          We'll never share your email with anyone else
        </div>
        <button
          className="resetbutton"
          type="submit"
          onClick={() => Postdata()}
        >
          Send Login Link{" "}
        </button>
      </div>
    </div>
  );
};
export default Reset;
