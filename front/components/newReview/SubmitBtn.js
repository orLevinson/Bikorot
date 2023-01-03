import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { contextData } from "../../context/context";
import { reviewContextData } from "../../context/contextReview";

const SubmitBtn = (props) => {
  const [loading, setLoading] = useState(false);
  const { sendReview } = useContext(reviewContextData);
  const { userData } = useContext(contextData);
  const router = useRouter();

  // unitData isnt being saved after going to the other pages for some reason
  const submitHandler = async () => {
    setLoading(true);
    try {
      const body = await sendReview(userData.id, userData.token);
      console.log(body);
      props.openModal("success", "הביקורת נוספה בהצלחה");
      setLoading(false);
      router.push("/dashboard");
    } catch (err) {
      props.openModal("danger", err.message);
      setLoading(false);
    }
  };

  return (
    <Button disabled={loading} onClick={submitHandler}>
      {!loading ? "סיים" : "בטעינה"}
    </Button>
  );
};

export default SubmitBtn;
