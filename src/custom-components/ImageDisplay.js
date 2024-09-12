import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { list, getUrl } from '@aws-amplify/storage';
import { getCurrentUser } from '@aws-amplify/auth';

const ImageDisplay = forwardRef((props, ref) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  
  const verifyUser = async () => {
        // Verify that the current user exists
        try {
            const userId = (await getCurrentUser()).userId;
            console.log(userId);
            setUserId(userId);
        }
        catch (err) {
            console.error("User error: ", err);
        }
  }

  // Fetch the list of files from S3
  const fetchFiles = async () => {
        try {

            // List the files in S3 that are uploaded by the specific user.
            const s3Files = await list({
                path: 'protected/' + userId + '/'
            });

            console.log(s3Files); // Troubleshooting

            setFiles(s3Files.items || []);
        } catch (err) {
            console.error('Error fetching files:', err);
            setError('Error fetching files from S3');
        }
    };
  
    // Expose the fetchFiles function to the parent
  useImperativeHandle(ref, () => ({
    fetchFiles
  }));

  // Handle file selection from the dropdown
  const handleFileSelect = async (e) => {
    console.log(files);
    console.log(e);
    const fileName = e.target.value;
    setSelectedFile(fileName);
    setError('');
    
    if (fileName) {
      try {
        // Get the public URL for the selected file
        const signedUrl = await getUrl({
            path: 'protected/' + userId + '/' + fileName
        }); 
        console.log(signedUrl); // Troubleshooting
        setImageUrl(signedUrl.url);
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
    const initalize = async () => {
        await verifyUser();
        if (userId) {
            fetchFiles();
        }
    };
    initalize();
  }, [userId]);

  return (
    <div>
      <h2>Select an Image from S3</h2>

      {/* Dropdown for selecting files */}
      <select onChange={handleFileSelect} value={selectedFile}>
        <option value="">-- Select a file --</option>
        {files.map((file) => (
          <option key={file.key} value={file.key}>
            {file.path.split("/")[2]}
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
});

export default ImageDisplay;
