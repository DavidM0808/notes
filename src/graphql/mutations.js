const customCreateItem = `
  mutation CustomCreateItem($input: CreateItemInput!) {
    customCreateItem(input: $input) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
