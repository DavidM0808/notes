import React, { useState, useEffect } from 'react';
import { list, getUrl } from '@aws-amplify/storage';
import { getCurrentUser } from '@aws-amplify/auth';

const S3FileSelector = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  // Fetch the list of files from S3
const fetchFiles = async () => {

    // Verify that the current user exists
    try {
        const userId = (await getCurrentUser()).userId;
        console.log(userId);
    }
    catch (err) {
        console.error("User error: ", err);
    }

    try {

        const userId = (await getCurrentUser()).userId;

        // List the files in S3 that are uploaded by the specific user.
        const s3Files = await list({
            path: 'protected/' + userId + '/'
        })
        setFiles(s3Files);
    } catch (err) {
        console.error('Error fetching files:', err);
        setError('Error fetching files from S3');
    }
  };

  // Handle file selection from the dropdown
  const handleFileSelect = async (e) => {
    const fileName = e.target.value;
    setSelectedFile(fileName);
    setError('');
    
    if (fileName) {
      try {
        const userId = (await getCurrentUser()).userId;
        // Get the public URL for the selected file
        const signedUrl = await getUrl({
            path: 'protected/' + userId + '/' + fileName;
        }); 
        setImageUrl(signedUrl);
      } catch (err) {
        console.error('Error getting file URL:', err);
        setError('Error loading the selected file.');
      }
    } else {
      setImageUrl(''); // Clear image if no file is selected
    }
  };

  // Load the files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h2>Select an Image from S3</h2>

      {/* Dropdown for selecting files */}
      <select onChange={handleFileSelect} value={selectedFile}>
        <option value="">-- Select a file --</option>
        {files.map((file) => (
          <option key={file.key} value={file.key}>
            {file.key}
          </option>
        ))}
      </select>

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Image display with border */}
      <div style={{ border: '2px solid black', width: '300px', height: '300px', marginTop: '20px' }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Selected from S3"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <p>No image selected</p>
        )}
      </div>
    </div>
  );
};

export default S3FileSelector;
