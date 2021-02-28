import React from 'react';

export default ({ getRootProps, getInputProps, open, isDragActive, acceptedFiles, ...props }) => {

  return (
    <div className="container mt-2">
      <div
        style={{ backgroundColor: "#F6F6F6" }}
        {...getRootProps({ className: `dropzone flex items-center border-dashed ${isDragActive ? 'border-link' : 'border-gray-300'} border-2 rounded` })}
      >
        <input {...getInputProps()} />
        <img className="w-12 h-12 m-4" src={require("./assets/upload.png")} />
        {
          isDragActive
            ?
              <p className="text-link text-center">
                Drop this file here...
              </p>
            :
            <p className="text-gray-400 text-center">
              Drag here or <span className="text-link cursor-pointer" onClick={open}>browse</span> to upload
              </p>
        }
      </div>
      {
        acceptedFiles.length > 0
        &&
        <aside>
          <p className="text-gray-400 m-2">
            {acceptedFiles[0].path} - {acceptedFiles[0].size} bytes
              </p>
        </aside>
      }
    </div>
  );
}
