import { useState } from "react";

const useNotify = () => {
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const notify = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast((previous) => ({ ...previous, open: false }));
  };

  return { notify, toastProps: { ...toast, onClose: closeToast } };
};

export default useNotify;
