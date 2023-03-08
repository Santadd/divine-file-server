import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import { toast } from "react-toastify";
export default function ConfirmAccountPage() {
  const { token } = useParams();
  const api = useApi();
  const navigate = useNavigate();

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      const response = await api.get(`/auth/emailconfirmation/${token}`);
      console.log(response);
      if (isMounted && !response.ok) {
        toast.error(response.body.message, {
          position: toast.POSITION.TOP_CENTER,
          theme: "colored",
        });
        navigate("/login");
      } else if (isMounted) {
        toast.success(response.body.message, {
          position: toast.POSITION.TOP_CENTER,
          theme: "colored",
        });
        navigate("/login");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [token, api, navigate]);
  return null;
}
