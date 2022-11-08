import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const actieveHttpRequests = useRef([]); //store data accross re render cycle (if the user change page before we finish the proccess with the DB)
  //we use useRef and not useState because we dont wont to update the UI.

  //when the component that use this hook re render
  //useCallback make sure that there are no infinity loops when ever the component is rerender
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController(); //API Supported in modern browser
      //current properties -> access to the data in useRef
      actieveHttpRequests.current.push(httpAbortCtrl);
      try {
        const response = await fetch(url, {
          method, //method: method
          body,
          headers,
          signal: httpAbortCtrl.signal, //link the AbortController to this request
        });
        const responseData = await response.json();
        actieveHttpRequests.current = actieveHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        ); //filter all the old request controller
        if (!response.ok) {
          //the response.ok will be true if the status code is 200
          // not ok is mean we got 400 or 500
          throw new Error(responseData); //trigger the catch block
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err);
        setIsLoading(false);
        throw err;
        return null;
      }
    },
    [] //no specific dependecie so we add an empty array
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    //when we return a function in this first function than the return function is excecuted as a clean function
    //before the next time use effect runs again or also when the component that uses useEffect unmounts
    return () => {
      actieveHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError }; //isLoading:isLoading , error:error
};
