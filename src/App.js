import { NavBar, NoteUICollection, CreateNote, UpdateNote } from './ui-components';
import { useState, useEffect, useRef } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import CreateItem from './custom-components/CreateItem';
// import UpdateItem from './custom-components/UpdateItem';
// import DeleteItem from './custom-components/DeleteItem';
import ImageUpload from './custom-components/ImageUpload';
import ImageDisplay from './custom-components/ImageDisplay';

import { generateClient } from 'aws-amplify/api';
import { syncNotes } from './graphql/queries';
import { deleteNotes } from './graphql/mutations';
import { getCurrentUser } from '@aws-amplify/auth';

const client = generateClient();

function App({ signOut }) {

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateNote, setUpdateNote] = useState([]);
  const [userId, setUserId] = useState('');

  // Custom state for all the notes
  const [notes, setNotes] = useState([]);

  // Creating a reference for sucesfully uploaded image
  const imageDisplayRef = useRef(null);

  // Function to verify user
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

  // Function to fetch notes
  const fetchNotes = async () => {
    const result = await client.graphql({
      query: syncNotes,
      variables: {
        filter: null,
        lastSync: null
      }
    });
    const filteredNotes = result.data.syncNotes.items.filter(note => note._deleted !== true);
    const secondFilteredNotes = filteredNotes.filter(note => note.owner === userId);
    setNotes(secondFilteredNotes);
  }

  // Fetch notes when the component mounts
  useEffect(() => {
    const initialize = async () => {
      await verifyUser();
      if (userId) {
        fetchNotes();
      }
    }
    initialize();
  }, [userId]);

  // Callback to handle after creating a note
  const handleCreateSuccess = (newNote) => {
    // fetchNotes(); // Refresh the list of notes after a new one is created
    setNotes(prevNotes => [...prevNotes, newNote]);
  };

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
            signOut()
          }
          console.log("Sign out button clicked")
        }}
      }} />


      <div className='container'>
      <NoteUICollection items={notes} overrideItems={ ({item, idx}) => {
        return {
          overrides: {
            Vector31472745: {
              as: 'button', 
              onClick: () => {
                setShowUpdateModal(true)
                setUpdateNote(item)
              }
            },
            MyIcon: {
              onClick: async () => {
                try {
                  const result = await client.graphql({
                    query: deleteNotes,
                    variables: {
                      input: {
                        id: item.id,
                        _version: item._version
                      }
                    }
                  });
                  console.log("Note deleted: ", result);
                }
                catch(err){
                  console.error("Delete Error: ", err);
                }

                setNotes(prevNotes => prevNotes.filter(note => note.id !== item.id));
              }
            }
          },

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
        <CreateItem onCreateSuccess={handleCreateSuccess}/>
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
