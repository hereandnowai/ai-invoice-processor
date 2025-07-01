import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '../constants';
import { useLanguage } from '../contexts/LanguageContext'; // Import useLanguage

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  isLoading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, isLoading }) => {
  const [errors, setErrors] = useState<string[]>([]);
  const { t } = useLanguage(); // Get t function

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setErrors([]);
    if (fileRejections.length > 0) {
      const currentErrors: string[] = fileRejections.flatMap((rejection: any) => 
        rejection.errors.map((err: any) => {
          if (err.code === 'file-too-large') {
            return `File "${rejection.file.name}" is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`; // TODO: Translate
          }
          if (err.code === 'file-invalid-type') {
            return `File "${rejection.file.name}" has an invalid type. Supported types: ${SUPPORTED_FILE_TYPES.join(', ')}.`; // TODO: Translate
          }
          return err.message;
        })
      );
      setErrors(currentErrors);
      return;
    }
    
    if (acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles);
    }
  }, [onFilesSelected, MAX_FILE_SIZE_MB]); // Removed t from dependencies, as it shouldn't change often

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: SUPPORTED_FILE_TYPES.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: true,
    disabled: isLoading,
  });

  const baseStyle = "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ease-in-out";
  const activeStyle = "border-primary bg-primary/10";
  const acceptStyle = "border-green-500 bg-green-500/10";
  const rejectStyle = "border-red-500 bg-red-500/10";
  const focusStyle = "ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900";

  const style = `
    ${baseStyle}
    ${isDragActive ? activeStyle : 'border-gray-300 dark:border-gray-600 hover:border-primary/70 dark:hover:border-primary-hover/70'}
    ${isDragAccept ? acceptStyle : ''}
    ${isDragReject ? rejectStyle : ''}
    ${isFocused ? focusStyle : ''}
    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
      <div {...getRootProps({ className: style })}>
        <input {...getInputProps()} />
        <svg className={`w-16 h-16 mb-4 ${isDragActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.045 4.213A4.5 4.5 0 0117.25 19.5H6.75z" />
        </svg>

        {isDragActive ? (
          <p className="text-lg font-semibold text-primary">{t('fileUploadDragDrop')}</p> 
        ) : (
          <>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('fileUploadDragDrop')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('fileUploadSupported')} ({t('fileUploadMaxMB', MAX_FILE_SIZE_MB)})</p>
          </>
        )}
         {isLoading && <p className="mt-2 text-sm text-primary">{t('loading')}...</p>}
      </div>
      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-600 rounded-md">
          <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300">
            {errors.map((error, i) => <li key={i}>{error}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
