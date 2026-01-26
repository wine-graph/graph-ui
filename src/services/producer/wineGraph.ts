import {gql} from "@apollo/client";

// Create a new wine for a producer — mirrors the style used in ADD_PRODUCER
// Expects backend schema:
//   type WineMutation { addWine(input: WineInput!): Wine }
export const ADD_WINE_MUTATION = gql(`
  mutation AddWine($input: WineInput!) {
    Wine {
      addWine(input: $input) {
        id
        name
        slug
        producer
        varietal
        vintage
      }
    }
  }
`)

export const WINE_BY_ID = gql(`
  query($id: ID!) {
    Wine {
      wine(id: $id) {
        id
        name
        slug
        description
        varietal
        vintage
        alcohol
        producer
        color
        closure
        type
        shape
      }
    }
  }
`)