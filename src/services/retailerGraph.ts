import {gql} from "@apollo/client";

const RETAILER_QUERY = gql(`
  query($id: ID!) {
    Retailer {
      retailer(retailerId: $id) {
        id
        name
        pos
        inventory {
          name
          varietal
          vintage
        }
        location {
          zipCode
          website
          address
          city
          contactEmail
          phone
          id
          state
        }
      }
    }
 }
`);

export {RETAILER_QUERY};