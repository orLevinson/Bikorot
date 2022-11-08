import { useState } from "react";
import SnackbarContent from "./SnackbarContent";

const CustomSnackbarContent = (props) => {
    const [loading, setLoading] = useState(false);
    if(!!loading){
        return (
            <SnackbarContent
            message={props.message}
            rtlActive
            key={props.key}
            loading
          />  
        );
    }
  return (
    <div>
      <SnackbarContent
        message={props.message}
        rtlActive
        key={props.key}
        onClose={async () => {
        setLoading(true);
        await props.onClose();
        setLoading(false);
        }}
        close
      />
    </div>
  );
};

export default CustomSnackbarContent;
