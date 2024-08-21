const customCreateItem = `
  mutation CustomCreateItem($input: CreateItemInput!) {
    customCreateItem(input: $input) {
      id
      title
      text
      createdAt
      updatedAt
    }
  }
`;
