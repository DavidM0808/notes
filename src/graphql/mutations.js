import { gql } from 'graphql-tag';

export const customCreateNotes = gql`
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

export const customUpdateNotes = gql`
  mutation CustomUpdateNotes($input: UpdateNotesInput!) {
    customUpdateNotes(input: $input) {
      id
      title
      text
      createdAt
      updatedAt
    }
  }
`

export const customDeleteNotes = gql`
  mutation CustomDeleteNotes($id: ID!) {
    customDeleteNotess(id: $id) {
      id
      title
      text
      createdAt
      updatedAt
    }
  }
`