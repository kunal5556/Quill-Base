import { useCallback, useMemo, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useUploadImageMutation } from "../../features/admin/adminApi";
import buildImageFormData from "../../utils/buildImageFormData";

const editorFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "blockquote",
  "code-block",
  "link",
  "image",
];

function RichTextEditor({ value, onChange }) {
  const quillRef = useRef(null);
  const [uploadImage] = useUploadImageMutation();

  const handleToolbarImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";

    input.onchange = async () => {
      const file = input.files[0];

      if (!file) {
        return;
      }

      const result = await uploadImage(buildImageFormData(file));
      const editor = quillRef.current?.getEditor();

      if (result.data && editor) {
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, "image", result.data.url);
        editor.setSelection(range.index + 1);
      }
    };

    input.click();
  }, [uploadImage]);

  const editorModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
        handlers: { image: handleToolbarImage },
      },
    }),
    [handleToolbarImage]
  );

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={editorModules}
        formats={editorFormats}
      />
    </div>
  );
}

export default RichTextEditor;
