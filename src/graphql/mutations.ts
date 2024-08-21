const customCreateItem: string = `
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