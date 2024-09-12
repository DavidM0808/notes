import React, { useState } from 'react';
import { DataStore } from 'aws-amplify/datastore';
import { generateClient } from 'aws-amplify/api';
import { createNote } from '../graphql/mutations'; // Import the generated mutation
import { syncNotes } from '../graphql/queries';

const client = generateClient();

const CreateItem = ({onCreateSuccess}) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');


  const onChangeTitle = e => {

    console.log(typeof(e.target.value));

    setTitle(e.target.value);

  }

  const onChangeText = e => {
    console.log(typeof(e.target.value));

    setText(e.target.value);

  }


  const handleCreateItem = async () => {
    const input = { id: `notes-${Date.now()}`, title, text };

    console.log({title, text}); // Troubleshooting


    try {
      // Creating a new note
      const result = await client.graphql({
        query: createNote,
        variables: { input: input}
      });
      console.log(result);
      
      const newNote = result.data.createNote;
      console.log('Item created:', newNote);

      // Re-fetch the notes to update the UI
      const notes = await client.graphql({
        query: syncNotes,
        variables: {
          filter: null,
          lastSync: null
        }
      });
      console.log('Fetched notes after creation:', notes);

      // Call the callback to refresh the notes
      if (onCreateSuccess) {
        await DataStore.clear();
        onCreateSuccess(newNote);
      }
    } catch (error) {
      console.error('Error creating item:', error);
    }

  };

  return (
    <div>
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={onChangeTitle}
      />
      <input
        type="text"
        placeholder="text"
        value={text}
        onChange={onChangeText}
      />
      <button onClick={handleCreateItem}>Create Item</button>
    </div>
  );
};

export default CreateItem;
