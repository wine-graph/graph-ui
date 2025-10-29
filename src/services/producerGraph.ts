import {gql} from "@apollo/client";

const PRODUCERS_QUERY = gql(`
  query {
    Producer {
      producers {
        id
        name
        description
        email
        phone
        website
        wines {
          id
          name
        }
      }
    }
  }
`)

export {PRODUCERS_QUERY};