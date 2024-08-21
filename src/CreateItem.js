import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { customCreateItem } from './graphql/mutations'; // Import the generated mutation

const CreateItem = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateItem = async () => {
    const input = { id: `${Date.now()}`, name, description };

    try {
      const result = await API.graphql(graphqlOperation(customCreateItem, { input }));
      console.log('Item created:', result.data.customCreateItem);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleCreateItem}>Create Item</button>
    </div>
  );
};

export default CreateItem;
