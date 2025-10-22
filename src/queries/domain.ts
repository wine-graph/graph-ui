import { gql } from "@apollo/client";

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

const RETAILER_QUERY = gql(`
  query($id: ID!) {
    Retailer {
      retailer(retailerId: $id) {
        id
        name
        inventory {
          name
          varietal
          vintage
        }
      }
    }
 }
`);

export { DOMAIN_QUERY };
export { RETAILER_QUERY };
