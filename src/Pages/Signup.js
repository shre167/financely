import React from "react";
import Header from "../components/Header/Index";
import SignupSigninComponent from "../components/SignupSignin/Index";


function Signup() {
  return (
    <div>
      <Header /> 
      <div className="wrapper">
        <SignupSigninComponent />
      </div>
    </div>
  );
}

export default Signup;
