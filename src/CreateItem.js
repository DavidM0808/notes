import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { customCreateItem } from './graphql/mutations'; // Import the generated mutation

const client = generateClient();

const CreateItem = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const handleCreateItem = async () => {
    const input = { id: `${Date.now()}`, title, text };

    try {
      const result = await client.graphql({
        query: customCreateItem,
        variables: { input: input }
      });
      console.log('Item created:', result.data.customCreateItem);
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
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleCreateItem}>Create Item</button>
    </div>
  );
};

export default CreateItem;
