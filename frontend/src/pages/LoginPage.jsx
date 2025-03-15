import React from "react";
import AuthForm from "../components/authForm";
import ConnectionTest from "../components/ConnectionTest";

const LoginPage = () => {
  return (
    <div>
      <AuthForm type="login" />
      {/* <ConnectionTest /> */}
    </div>
  );
};

export default LoginPage;
