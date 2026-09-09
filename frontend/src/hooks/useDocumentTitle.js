import { useEffect } from "react";

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | Quill Base` : "Quill Base";

    return () => {
      document.title = "Quill Base";
    };
  }, [title]);
};

export default useDocumentTitle;
