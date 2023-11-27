 import Image from "next/image";
import React, {FC} from "react";
 import {BiSearch} from "react-icons/bi";
 type Props= {};

 const Hero: FC<Props> =(props) =>{

    return(
<>
<div className="w-full 1000px:flex items-center">
<div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500px:w-[700px] 110px:h-[600px] 1100px:w-[600px] h-[50vh] w-[50vh] hero_animation rounded-full">
<div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px: [0] z-10">
<Image src={require("../.../../../../public/Girl2.webp")}
             alt="girl_model"
           className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-[10] rounded-xl"
           />
           </div>
           </div>
           </div>
</>
    )
 }

 export default Hero;
