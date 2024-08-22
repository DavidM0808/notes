import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { customDeleteNotes } from './graphql/mutations';

const client = generateClient();

const DeleteItem = () => {
  const [id, setId] = useState('');

  const handleDeleteItem = async () => {
    try {
      const result = await client.graphql({
        query: customDeleteNotes,
        variables: {input: input}
      });
      console.log('Item deleted:', result.data.customDeleteItem);
    } catch (error) {
      console.error('Error deleting item:', error);
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
      <button onClick={handleDeleteItem}>Delete Item</button>
    </div>
  );
};

export default DeleteItem;
