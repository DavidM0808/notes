const customCreateNotes = `
  mutation CustomCreateNotes($input: CreateNotesInput!) {
    customCreateNotes(input: $input) {
      id
      title
      text
      createdAt
      updatedAt
    }
  }
`;