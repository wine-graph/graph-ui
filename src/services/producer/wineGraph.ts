import {gql} from "@apollo/client";

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

export const WINE_PUBLIC_PAGE_QUERY = gql(`
  query WinePublicPage($id: ID, $slug: String) {
    Wine {
      wine(id: $id, slug: $slug) {
        id
        name
        slug
        description
        varietal
        vintage
        matchCount
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
