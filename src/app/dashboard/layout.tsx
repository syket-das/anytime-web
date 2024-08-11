import React from "react";
import { Wrapper } from "./_components/Wrapper";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default layout;
