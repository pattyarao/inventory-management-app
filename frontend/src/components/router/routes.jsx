import React from "react";
import Onboarding from "../../pages/Onboarding";
import Home from "../../pages/Home";

const routes = [
  {
    path: "/signin",
    element: <Onboarding />,
  },
  {
    path: "/home",
    element: <Home />,
  },
];

export default routes;
