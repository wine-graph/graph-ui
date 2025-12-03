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
          producer
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

const RETAILER_ONBOARDING_MUTATION = gql(`
  mutation OnboardRetailer($merchantId: ID!) {
    Retailer {
      onboard(merchantId: $merchantId, pos: SQUARE) {
        id
        pos
        name
        location {
          id
          website
          contactEmail
          phone
          address
          city
          state
          zipCode
        }
      }
    }
  }
`)

// Triggers a backend sync of inventory for the given Square merchant
// Note: despite the name, this is a mutation (kept for backward compatibility)
const RETAILER_INVENTORY_MUTATION = gql(`
  mutation SyncRetailerInventory($merchantId: ID!) {
    Retailer {
      syncInventory(merchantId: $merchantId) {
        name
        vintage
        varietal
      }
    }
  }
`)

export {RETAILER_QUERY, RETAILERS_QUERY, RETAILER_INVENTORY_MUTATION, RETAILER_ONBOARDING_MUTATION};