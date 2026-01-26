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
        varietal
        vintage
      }
    }
  }
`)

export const WINE_BY_ID_ENRICHED = gql(`
  query($id: ID!) {
    Wine {
      enriched(id: $id) {
        id
        name
        slug
        description
        varietal
        vintage
        createdAt
        producer {
          id
          name
          slug
        }
        retailers {
          id
          name
        }
      }
    }
  }
`)