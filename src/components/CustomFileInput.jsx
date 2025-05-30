"use client"

import { cn } from "@/lib/utils"
import { FileText, ImageIcon, Loader, Upload, X } from "lucide-react"
import { useEffect, useState } from "react"

const CustomFileInput = ({
  signupForm,
  acceptedTypes = ["application/pdf"],
  className,
  onReset,
  multiple = false,
  maxFiles = 1,
  fieldName,
  disabled = false
}) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Determine field name based on multiple mode or custom fieldName
  const formFieldName = fieldName || (multiple ? "files" : "file")

  // Create accept string for input element
  const acceptString = acceptedTypes.join(",")

  // Clear files function
  const clearFiles = () => {
    setFiles([])
    setUploadSuccess(false)
    // if (signupForm?.setValue) {
    //   signupForm.setValue(formFieldName, [])
    //   if (signupForm.trigger) {
    //     signupForm.trigger(formFieldName)
    //   }
    // }
  }

  // console.log('signupForm', signupForm)

  useEffect(() => {
    if (onReset) {
      clearFiles()
    }
  }, [onReset])

  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") {
      return <FileText size={16} className="text-red-500" />
    } else if (fileType.startsWith("image/")) {
      return <ImageIcon size={16} className="text-blue-500" />
    }
    return <FileText size={16} className="text-gray-500" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateFile = (file) => {
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Accepted: ${acceptedTypes.join(", ")}`
    }

    // Size validation for PDFs
    if (file.type === "application/pdf" && file.size > 5 * 1024 * 1024) {
      return "PDF file size must be less than 5MB"
    }

    // General size limit for other files (10MB)
    if (file.type !== "application/pdf" && file.size > 10 * 1024 * 1024) {
      return "File size must be less than 10MB"
    }

    return null
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (!selectedFiles.length) return

    setLoading(true)

    setTimeout(() => {
      const newFiles = []
      const errors = []

      // Check if adding new files would exceed maxFiles limit
      if (files.length + selectedFiles.length > maxFiles) {
        if (signupForm?.setError) {
          signupForm.setError(formFieldName, {
            type: "manual",
            message: `Maximum ${maxFiles} files allowed`,
          })
        }
        setLoading(false)
        return
      }

      selectedFiles.forEach((file, index) => {
        const error = validateFile(file)
        if (error) {
          errors.push(`${file.name}: ${error}`)
        } else {
          // Check for duplicate files
          const isDuplicate = files.some(
            (existingFile) => existingFile.name === file.name && existingFile.size === file.size,
          )

          if (!isDuplicate) {
            newFiles.push({
              id: Date.now() + index,
              file: file,
              name: file.name,
              size: file.size,
              type: file.type,
            })
          } else {
            errors.push(`${file.name}: File already uploaded`)
          }
        }
      })

      if (errors.length > 0) {
        if (signupForm?.setError) {
          signupForm.setError(formFieldName, {
            type: "manual",
            message: errors.join("; "),
          })
        }
      } else {
        if (signupForm?.clearErrors) {
          signupForm.clearErrors(formFieldName)
        }
      }

      if (newFiles.length > 0) {
        let updatedFiles

        if (!multiple) {
          // Single file mode - replace existing file
          updatedFiles = [newFiles[0]]
        } else {
          // Multiple files mode - add to existing files
          updatedFiles = [...files, ...newFiles]
        }

        setFiles(updatedFiles)
        setUploadSuccess(true)

        // Set form value as array
        if (signupForm?.setValue) {
          const fileArray = updatedFiles.map((f) => f.file)
          signupForm.setValue(formFieldName, fileArray)

          // Trigger validation if available
          if (signupForm.trigger) {
            signupForm.trigger(formFieldName)
          }
        }

        console.log("Files uploaded:", updatedFiles.length)
      }

      setLoading(false)
      // Reset input value to allow re-uploading same file
      e.target.value = ""
    }, 500)
  }

  const removeFile = (fileId) => {
    const updatedFiles = files.filter((f) => f.id !== fileId)
    setFiles(updatedFiles)

    // Set form value as array
    if (signupForm?.setValue) {
      const fileArray = updatedFiles.map((f) => f.file)
      signupForm.setValue(formFieldName, fileArray)

      // Trigger validation if available
      if (signupForm.trigger) {
        signupForm.trigger(formFieldName)
      }
    }

    if (updatedFiles.length === 0) {
      setUploadSuccess(false)
    }
  }

  const handleClick = () => {
    document.getElementById(`file-input-${formFieldName}`).click()
  }

  return (
    <div className="flex flex-col items-start justify-start
    gap-4 w-full">

      {/* Hidden File Input */}
      <input
        id={`file-input-${formFieldName}`}
        type="file"
        accept={acceptString}
        onChange={handleFileChange}
        className="hidden"
        multiple={multiple}
        disabled={disabled}
      />

      {/* Custom Upload Button */}
      <div
        onClick={handleClick}
        className={cn(
          `flex font-inter justify-center items-center flex-col bg-zinc-800
          gap-2 p-4 rounded-lg hover:bg-zinc-900 border-2 border-dashed border-zinc-600
          cursor-pointer w-full transition-colors`,
          className,
        )}
      >
        <Upload size={25} className="text-white" />

        {loading ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin text-white" size={20} />
            <span className="ml-2 text-xs text-zinc-300">Processing file{multiple ? "s" : ""}...</span>
          </div>
        ) : (
          <div className="flex font-inter justify-center items-center flex-col">
            {files.length > 0 && !multiple ? (
              <label className="text-sm text-zinc-300 capitalize font-medium">Click to replace file</label>
            ) : (
              <label className="text-sm text-zinc-300 capitalize font-medium">
                {files.length > 0 && multiple ? "Add more files" : `Click to upload ${multiple ? "files" : "file"}`}
              </label>
            )}
            <p className="text-xs font-light text-zinc-400 mt-1">Support: {acceptedTypes.join(", ")}</p>
            {multiple && (
              <p className="text-xs font-light text-zinc-500">
                Max {maxFiles} files • {files.length}/{maxFiles} uploaded
              </p>
            )}
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      <div className="w-full">
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-zinc-300">
                Uploaded File{multiple && files.length > 1 ? "s" : ""}: ({files.length})
              </h4>
              {files.length > 1 && (
                <button
                  onClick={clearFiles}
                  className="text-xs text-red-400 hover:text-red-300 underline"
                  type="button"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="max-h-40 min-h-12 overflow-y-auto hide-scrollbar">
              <div className={`space-y-2 text-wrap relative w-full`}>
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="relative flex w-full items-center
                    justify-between bg-zinc-800 p-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {getFileIcon(f.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm max-xs:text-sm text-zinc-300 truncate font-medium">
                          {f.name}
                        </p>
                        <p className="text-xs text-zinc-500 max-xs:text-xs">
                          {formatFileSize(f.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(f.id)}
                      className="ml-2 p-1 hover:bg-zinc-700 rounded-full transition-colors"
                      type="button"
                    >
                      <X size={16} className="text-zinc-400 hover:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Message */}
      {uploadSuccess && files.length > 0 && (
        <div className="w-full">
          <p className="text-xs text-green-400 text-left">
            {files.length} file{files.length > 1 ? "s" : ""} uploaded successfully!
          </p>
        </div>
      )}
    </div>
  )
}

export default CustomFileInput
