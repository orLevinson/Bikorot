import React, { createContext, useContext, useEffect, useState } from "react";
import { useHttpClient } from "../components/Hooks/http-hook";

export const contextData = createContext({
  userData: {
    token: null,
    name: null,
    id: null,
    perms: "",
  },
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const ContextProvider = (props) => {
  const [userData, setUserData] = useState({
    token: null,
    name: null,
    id: null,
    perms: "",
  });
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const logoutHandler = () => {
    setUserData({
      token: null,
      name: null,
      id: null,
      perms: "",
    });
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("expiration");
  };

  const loginHandler = async (personalNum, password) => {
    try {
      const response = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/users/login`,
        "POST",
        JSON.stringify({
          personalNum,
          password,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      if (!!response.success && !!response.token) {
        setUserData({
          token: response.token,
          name: response.name,
          id: response.id,
          perms: response.perms,
        });
        const now = new Date();
        const inAWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        localStorage.setItem("expiration", JSON.stringify(inAWeek));
        localStorage.setItem("id", response.id);
        localStorage.setItem("token", `Bearer ${response.token}`);
        setTimeout(() => {
          logoutHandler();
        }, inAWeek.getTime() - now.getTime());
      } else {
        throw new Error();
      }
    } catch (err) {
      clearError();
      throw new Error();
    }
  };

  const registerHandler = async (name, personalNum, password) => {
    try {
      const response = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_ADDRESS}api/users/register`,
        "POST",
        JSON.stringify({
          name,
          personalNum,
          password,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      if (!!response.success && !!response.token) {
        setUserData({
          token: response.token,
          name: response.name,
          id: response.id,
          perms: response.perms,
        });

        const now = new Date();
        const inAWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        localStorage.setItem("expiration", JSON.stringify(inAWeek));
        localStorage.setItem("id", response.id);
        localStorage.setItem("token", `Bearer ${response.token}`);
        setTimeout(() => {
          logoutHandler();
        }, inAWeek.getTime() - now.getTime());
      } else {
        throw new Error();
      }
    } catch (err) {
      clearError();
      throw new Error();
    }
  };

  useEffect(() => {
    const reloadHandler = async () => {
      const token = localStorage.getItem("token");
      const expiration = localStorage.getItem("expiration");
      const id = localStorage.getItem("id");

      if (!!token && !!expiration && !!id) {
        const expirationDateObj = new Date(expiration);
        if (new Date().getTime() >= expirationDateObj.getTime()) {
          logoutHandler();
        } else {
          setTimeout(() => {
            logoutHandler();
          }, expirationDateObj.getTime() - new Date().getTime());

          //   get the perms and name from API
          try {
            const response = await sendRequest(
              `${process.env.NEXT_PUBLIC_API_ADDRESS}api/users/${id}`,
              "GET"
            );
            if (!!response.success && !!response.token) {
              setUserData({
                token: token,
                name: response.name,
                id: id,
                perms: response.perms,
              });
            }
          } catch (err) {
            clearError();
            logoutHandler();
          }
        }
      }
    };
    reloadHandler();
  }, []);

  return (
    <contextData.Provider
      value={{
        userData: userData,
        login: loginHandler,
        register: registerHandler,
        logout: logoutHandler,
      }}
    >
      {props.children}
    </contextData.Provider>
  );
};

export default ContextProvider;
