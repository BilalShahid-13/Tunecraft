import { Loader, Upload } from 'lucide-react'; // Importing the loader icon
import { useState } from 'react';
const CustomFileInput = ({ signupForm, formData }) => {
  const [fileName, setFileName] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [isPdf, setIsPdf] = useState(false);
  const [loading, setLoading] = useState(false); // To track file size check and loading state
  const [uploadSuccess, setUploadSuccess] = useState(false); // Track success state

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      signupForm.setError('file', { type: 'manual', message: 'Please upload a valid PDF.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      signupForm.setError('file', { type: 'manual', message: 'File size must be less than 5MB.' });
      return;
    }

    signupForm.setValue('file', file);
    // formData.append('file', file)
    // fs.writeFile(`../../public/uploads/${file.name}`, file);

    setFileName(file.name);
    setIsPdf(true);
    setUploadSuccess(true);
  };

  const handleClick = () => {
    document.getElementById('file-input').click(); // Trigger file input click on custom button click
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Hidden File Input */}
      <input
        id="file-input"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Custom Button */}
      <div
        onClick={handleClick}
        className="flex font-inter justify-center items-center flex-col bg-zinc-800 gap-2 p-3 rounded-lg hover:bg-zinc-900 cursor-pointer w-full"
      >
        <Upload size={25} className="text-white" />

        {loading ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin text-white" size={20} /> {/* Loader when file is too large */}
          </div>
        ) : (
          <>
            {fileName ? (
              <p className="text-xs font-light text-zinc-400">{fileName}</p>
            ) : (
              <div className="flex font-inter justify-center items-center flex-col">
                <label className="text-xs text-zinc-300 capitalize">Click to upload</label>
                <p className="text-xs font-light text-zinc-400">PDF</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Success Message after Upload */}
      {/* {uploadSuccess && (
        <div className="mt-2 input-error text-left w-full">
          <p>PDF uploaded successfully!</p>
        </div>
      )} */}
    </div>
  );
};

export default CustomFileInput;
