import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { updateNotes } from '../graphql/mutations';

const client = generateClient();

const UpdateItem = () => {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const handleUpdateItem = async () => {
    const input = { id, title, text };
    console.log(input);

    try {
      const result = await client.graphql({
        query: updateNotes,
        variables: {
          input: {
            id: id,
            title: title,
            text: text
          }
        }
      });
      console.log(result);
      console.log('Item updated:', result.data.updateNotes);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Item ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Updated Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Updated Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleUpdateItem}>Update Item</button>
    </div>
  );
};

export default UpdateItem;
