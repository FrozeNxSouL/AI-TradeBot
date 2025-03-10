// app/components/ThemeSwitcher.tsx
// "use client";

// import {useTheme} from "next-themes";
// import { useEffect, useState } from "react";
// import {VisuallyHidden, useSwitch} from "@heroui/switch";

// export function ThemeSwitcher() {
//   const [mounted, setMounted] = useState(false)
//   const { theme, setTheme } = useTheme()

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if(!mounted) return null

//   return (
//     <div>
//       The current theme is: {theme}
//       <button onClick={() => setTheme('light')}>Light Mode</button>
//       <button onClick={() => setTheme('dark')}>Dark Mode</button>
//     </div>
//   )
// };

// const ThemeSwitch = (props) => {
//     const {Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps} =
//       useSwitch(props);
  
//     return (
//       <div className="flex flex-col gap-2">
//         <Component {...getBaseProps()}>
//           <VisuallyHidden>
//             <input {...getInputProps()} />
//           </VisuallyHidden>
//           <div
//             {...getWrapperProps()}
//             className={slots.wrapper({
//               class: [
//                 "w-8 h-8",
//                 "flex items-center justify-center",
//                 "rounded-lg bg-default-100 hover:bg-default-200",
//               ],
//             })}
//           >
//             {isSelected ? <SunIcon /> : <MoonIcon />}
//           </div>
//         </Component>
//         <p className="text-default-500 select-none">Lights: {isSelected ? "on" : "off"}</p>
//       </div>
//     );
//   };