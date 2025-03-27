import React, { useRef } from "react";
import "./fileUploadOne.scss";
import uploadBlueIcon from "../../assets/uploadBlueIcon.svg";
import { useUploadImageMutation } from "../../apis&state/apis/global";
const FileUploadOne = ({
  fileLabel,
  fieldName,
  handleFileChangeValue,
  documentName,
}) => {
  const [uploadImage] = useUploadImageMutation();
  const file = useRef();
  const handleFile = () => {
    file.current.click();
  };

  const handleImageChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size > 1024 * 1024) {
      return toast.error("File size should not exceed 1 MB!");
    }
    if (
      selectedFile.name.endsWith(".jpg") ||
      selectedFile.name.endsWith(".jpeg") ||
      selectedFile.name.endsWith(".png") ||
      selectedFile.name.endsWith(".webp")
    ) {
      const reader = new FileReader();
      reader.onload = function (event) {
        // setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
      const formData = new FormData();
      formData.append("file", selectedFile);

      if (selectedFile) {
        // const imageUrl = URL.createObjectURL(selectedFile);
        // setSelectedImage(imageUrl);

        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
          const response = await uploadImage({
            data: formData,
            type: "DOCUMENTS",
          });
          if (response?.data) {
            const { fileUrl, file_uid } = response.data.data;
            handleFileChangeValue(event, selectedFile.name, {
              file_uid,
              imageUrl: fileUrl,
            });
            toast.success("Successfully uploaded your profile image!");
          }
        } catch (error) {
          toast.error("Something went wrong");
        }
      }
    } else {
      toast.error("It will allow .jpg, .jpeg, .png, .webp formats only.");
    }
  };
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       handleFileChangeValue(event, file.name, reader.result);
  //     };
  //     reader.onerror = (error) => {
  //       console.error("Error reading file:", error);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <div className="upload-file-card" onClick={handleFile}>
      <input
        type="file"
        className="input-file"
        ref={file}
        name={fieldName}
        onChange={handleImageChange}
      />
      <img src={uploadBlueIcon} alt="" />
      {documentName ? <p>{documentName}</p> : <p>Upload {fileLabel}</p>}
    </div>
  );
};

export default FileUploadOne;
