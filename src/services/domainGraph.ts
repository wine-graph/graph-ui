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
            producers {
              id
              name
            }
          }
        }
      }
    }
  }
`);

export {DOMAIN_QUERY};