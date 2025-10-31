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

const RETAILERS_QUERY = gql(`
  query {
    Retailer {
      retailers {
        pos
        name
        id
        location {
          zipCode
          website
          address
          city
          contactEmail
          phone
          id
          state
          coordinates {
            latitude
            longitude
          }
        }
      }
    }
  }
`)

export {RETAILER_QUERY, RETAILERS_QUERY};