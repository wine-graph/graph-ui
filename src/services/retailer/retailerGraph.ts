import {gql} from "@apollo/client";

const RETAILER_INVENTORY_PAGE_QUERY = gql(`
  query RetailerInventoryPage($id: ID!) {
    Retailer {
      retailer(retailerId: $id) {
        id
        name
        pos
        inventory {
          name
          varietal
          vintage
          slug
          canonicalId
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

const RETAILER_MARKETPLACE_QUERY = gql(`
  query RetailerMarketplace {
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

const PRODUCER_RETAILER_SOURCING_QUERY = gql(`
  query ProducerRetailerSourcing {
    Retailer {
      retailers {
        pos
        name
        id
        inventoryCount
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
`)

const RETAILER_COORDINATES_QUERY = gql(`
  query RetailerCoordinates($id: ID!) {
    Retailer {
      retailer(retailerId: $id) {
        location {
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
  mutation OnboardRetailer($merchantId: ID!, $pos: PosSource!) {
    Retailer {
      onboard(merchantId: $merchantId, pos: $pos) {
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

// Triggers a backend sync of inventory for the given merchant/provider
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

export {
  PRODUCER_RETAILER_SOURCING_QUERY,
  RETAILER_MARKETPLACE_QUERY,
  RETAILER_INVENTORY_PAGE_QUERY,
  RETAILER_INVENTORY_MUTATION,
  RETAILER_ONBOARDING_MUTATION,
  RETAILER_COORDINATES_QUERY
};
