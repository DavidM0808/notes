import React, { useState } from 'react';
import { uploadData } from '@aws-amplify/storage';
import { getCurrentUser } from '@aws-amplify/auth';

const ImageUpload = ({ onUploadSuccess }) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    setImage(file);
    setUploadSuccess(false);
    setError('');
  };

  // Handle image upload
  const handleUpload = async () => {

    if (!image) {
      setError('Please select an image to upload.');
      return;
    }

    setUploading(true);
    
    // Check if the user is verified under Cognito User Pool
    try {
      const userId = (await getCurrentUser()).userId;
      console.log(userId);

    }
    catch(err) {
      console.error('User error:', err);
    }

    try {
      const userId = (await getCurrentUser()).userId;
      // const fileName = `${Date.now()}-${image.name}`; // Unique file name
      const result = await uploadData({
        path: 'private/' + userId + '/' + image.name,
        data: image
      }).result;

      console.log(result);

      setUploading(false);
      setUploadSuccess(true);
      setImage(null); // Clear the selected image

      // Notify that the upload was successful
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setUploading(false);
      setError('Error uploading file. Please try again.');
      console.error('Upload error: ', err);
    }
  };

  return (
    <div>
      <h2>Upload an Image</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
      {uploadSuccess && <p style={{ color: 'green' }}>Image uploaded successfully!</p>}
    </div>
  );
};

export default ImageUpload;
