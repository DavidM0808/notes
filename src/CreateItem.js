import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { customCreateItem } from './graphql/mutations'; // Import the generated mutation
import { useDataStoreCreateAction } from './ui-components/utils';
import { schema } from './models/schema';
import { Notes } from './models';

const client = generateClient();

const CreateItem = () => {
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

  const handleCreateItem = useDataStoreCreateAction({
    fields: {
      title: title,
      text, text
    },
    model: Notes,
    schema: schema
  });
  

  // const handleCreateItem = async () => {
  //   const input = { id: `${Date.now()}`, title, text };

  //   console.log({title, text});

  //   try {
  //     const result = await client.graphql({
  //       query: customCreateItem,
  //       variables: { input: {
  //         title, text
  //       }}
  //     });
  //     console.log(result);
  //     console.log('Item created:', result.data.customCreateItem);
  //   } catch (error) {
  //     console.error('Error creating item:', error);
  //   }

  // };

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
