import Home from "../Home";
import AuthScreen from "../auth/AuthScreen";
import React, { useState } from "react";

const index = () => {
  let [isLogin, setIsLogin] = useState(false);
  return isLogin ? <Home /> : <AuthScreen setLogin={setIsLogin} />;
  // return <Home />;
};

export default index;
