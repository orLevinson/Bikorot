import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { contextData } from "../../context/context";
import { reviewContextData } from "../../context/contextReview";

const SubmitBtn = (props) => {
  const [loading, setLoading] = useState(false);
  const { editReview } = useContext(reviewContextData);
  const { userData } = useContext(contextData);
  const router = useRouter();

  // unitData isnt being saved after going to the other pages for some reason
  const submitHandler = async () => {
    setLoading(true);
    try {
      const body = await editReview(
        props.authorId,
        props.reviewId,
        userData.token
      );
      console.log(body);
      props.openModal("success", "הביקורת נערכה בהצלחה");
      setLoading(false);
      router.push("/dashboard");
    } catch (err) {
      props.openModal("danger", "עדכון הביקורת נכשל");
      setLoading(false);
    }
  };

  return (
    <Button disabled={loading} onClick={submitHandler}>
      {!loading ? "עדכן" : "בטעינה"}
    </Button>
  );
};

export default SubmitBtn;
