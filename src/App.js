import { NavBar, NoteUICollection, CreateNote, UpdateNote } from './ui-components';
import { useState, useRef } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
// import { DataStore } from 'aws-amplify/datastore';
import CreateItem from './custom-components/CreateItem';
// import UpdateItem from './custom-components/UpdateItem';
// import DeleteItem from './custom-components/DeleteItem';
import ImageUpload from './custom-components/ImageUpload';
import S3FileSelector from './custom-components/ImageDisplay';
import ImageDisplay from './custom-components/ImageDisplay';

function App({ signOut }) {

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateNote, setUpdateNote] = useState();

  // Creating a reference for sucesfully uploaded image
  const imageDisplayRef = useRef(null);

  // Callback function to refresh files upon upload
  const handleUploadSuccess = () => {
    if (imageDisplayRef.current) {
      imageDisplayRef.current.fetchFiles();
    }
  }

  return (
    <>

      <NavBar width="100%" marginBottom="20px" overrides={{
        Button31632483: {onClick: () => {
          setShowCreateModal(true)
          console.log("Create notes button clicked")
        }},
        Button31632487: {onClick: async () => {
          {
            // await DataStore.clear()
            signOut()
          }
          console.log("Sign out button clicked")
        }}
      }} />


      <div className='container'>
      <NoteUICollection overrideItems={ ({item, idx}) => {
        return {
          overrides: {
            Vector31472745: {
              as: 'button', 
              onClick: () => {
                setShowUpdateModal(true)
                setUpdateNote(item)
              }
            }
          }
        }
      }} />

      </div>

      <div className='modal' style={{display: showCreateModal === false && 'none'}}>
        <CreateNote overrides={{
          MyIcon: {as: 'button', onClick: () => setShowCreateModal(false)},
        }} />
      </div>
      
      <div className='modal' style={{display: showUpdateModal === false && 'none'}}>
        <UpdateNote notes={updateNote} overrides={{
          MyIcon: {as: 'button', onClick: () => setShowUpdateModal(false)}
        }}/>
      </div>

      <div style={{alignItems: 'center', margin: 500}}>
        <CreateItem />
      </div>

      <div style={{alignItems: 'center', margin:500}}>
        <ImageUpload onUploadSuccess={handleUploadSuccess}/>
      </div>

      <div style={{alignItems: 'center', margin:500}}>
        <ImageDisplay ref={imageDisplayRef}/>
      </div>

      {/* <div style={{alignItems: 'center', margin: 500}}>
        <DeleteItem />
      </div>

      <div style={{alignItems: 'center', margin: 500}}>
        <UpdateItem />
      </div> */}

    </>
  );
}

export default withAuthenticator(App);
