import { NavBar, NoteUICollection, CreateNote, UpdateNote } from './ui-components';
import { useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { DataStore } from 'aws-amplify/datastore';
import CreateItem from './CreateItem';

function App({ signOut }) {

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateNote, setUpdateNote] = useState();

  return (
    <>

      <NavBar width="100%" marginBottom="20px" overrides={{
        Button31632483: {onClick: () => {
          setShowCreateModal(true)
          console.log("Create notes button clicked")
        }},
        Button31632487: {onClick: async () => {
          {
            await DataStore.clear()
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

      {/* <NavBar width="100%" marginbottom="20px" />

      <div className='container'>
        <NoteUICollection />
      </div>

      <div className='modal' style={{display: 'none'}}>
        <CreateNote />
      </div>

      <div className='modal' style={{display: 'none'}}>
        <UpdateNote />
      </div> */}

    </>
  );
}

export default withAuthenticator(App);
