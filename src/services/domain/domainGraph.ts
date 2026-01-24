import {gql} from "@apollo/client";

const DOMAIN_QUERY = gql(`
  query {
    Domain {
      countries {
        id
        name
        description
        regions {
          id
          name
          description
          areas {
            id
            name
            description
          }
        }
      }
    }
  }
`);

const AREAS_QUERY = gql(`
  query {
    Domain {
      countries {
        regions {
          areas {
            id
            name
          }
        }
      }
    }
  }
`)

export {DOMAIN_QUERY, AREAS_QUERY};