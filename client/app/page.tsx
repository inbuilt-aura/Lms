"use client";

import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  return (
    <div>
      <Heading
        title="ECoders"
        description="ECoders is an online e-learning platform for students or professional developers to come and join us to build something amazing."
        keywords="Programming, development, MERN stack, software, learn, tutorials,coding"
      />
      <Header
      open={open}
      setOpen={setOpen}
      activeItem={activeItem}
      />
      <Hero/>
    </div>
  );
};

export default Page;
