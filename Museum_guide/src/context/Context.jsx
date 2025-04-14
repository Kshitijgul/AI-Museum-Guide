// import React, { createContext } from "react";
// import run from './../config/gemini';

// // 1. Create the context
// export const Context = createContext();

// // 2. Create the provider component
// const ContextProvider = (props) => {

//     const onSent = async (prompt) =>{
//         await run(prompt);

//     }

//     onSent("What is react js ")

//     const contextValue = {
//         // Add shared state or functions here
//     };

//     return (
//         <Context.Provider value={contextValue}>
//             {props.children}
//         </Context.Provider>
//     );
// };

// export default ContextProvider;
