import { Construction } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className="flex items-center justify-center h-[80%]">
      <div className="flex flex-col justify-center items-center border p-4 rounded border-yellow-600 ring-1 m-1 ">
        <Construction size={46} className="animate-bounce text-yellow-500" />
        <p className=" text-gray-500 mt-4">This page is under development</p>
      </div>
    </div>
  );
};

export default page;
