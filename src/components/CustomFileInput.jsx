import { cn } from '@/lib/utils';
import { Loader, Upload } from 'lucide-react'; // Importing the loader icon
import { useEffect, useState } from 'react';

const CustomFileInput = ({ signupForm, acceptedTypes = ['application/pdf'], className, onReset }) => {
  const [fileName, setFileName] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [isPdf, setIsPdf] = useState(false);
  const [loading, setLoading] = useState(false); // To track file size check and loading state
  const [uploadSuccess, setUploadSuccess] = useState(false); // Track success state

  // Create accept string for input element
  const acceptString = acceptedTypes.join(',');

  useEffect(() => {
    if (onReset) {
      setFileName('');
      setPreviewSrc('');
    }
  }, [onReset])


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    setTimeout(() => {
      // Validate file type against acceptedTypes
      if (!acceptedTypes.includes(file.type)) {
        signupForm.setError('file', { type: 'manual', message: `Please upload a valid file: ${acceptedTypes.join(', ')}` });
        setLoading(false);
        return;
      }

      // Only enforce 5MB limit for PDFs
      if (file.type === 'application/pdf' && file.size > 5 * 1024 * 1024) {
        signupForm.setError('file', { type: 'manual', message: 'PDF file size must be less than 5MB.' });
        setLoading(false);
        return;
      }

      // No size limit for other file types (or add your own if needed)

      signupForm.setValue('file', file);

      setFileName(file.name);
      setIsPdf(file.type === 'application/pdf');
      setUploadSuccess(true);
      setLoading(false);
    }, 500);
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
        accept={acceptString}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Custom Button */}
      <div
        onClick={handleClick}
        className={cn(`flex font-inter justify-center items-center flex-col bg-zinc-800
          gap-2 p-3 rounded-lg hover:bg-zinc-900
          cursor-pointer w-full`, className)}
      >
        <Upload size={25} className="text-white" />

        {loading ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin text-white" size={20} /> {/* Loader when file is too large or loading */}
          </div>
        ) : (
          <>
            {fileName ? (
              <p className="text-xs font-light text-zinc-400">{fileName}</p>
            ) : (
              <div className="flex font-inter justify-center items-center flex-col">
                <label className="text-xs text-zinc-300 capitalize">Click to upload</label>
                <p className="text-xs font-light text-zinc-400">Support Files: {acceptedTypes.join(', ')}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Success Message after Upload */}
      {/* {uploadSuccess && (
        <div className="mt-2 input-error text-left w-full">
          <p>File uploaded successfully!</p>
        </div>
      )} */}
    </div>
  );
};

export default CustomFileInput;
