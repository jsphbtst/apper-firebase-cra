import { createContext, useContext } from "react";

export const GlobalContext = createContext();

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

function GlobalProvider(props) {
  return (
    <GlobalContext.Provider value={props.value}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;
