import {gql} from "@apollo/client";

const PRODUCER_MARKETPLACE_QUERY = gql(`
  query ProducerMarketplace {
    Producer {
      all {
        slug
        name
        email
        phone
        website
        logo
      }
    }
  }
`)

const PRODUCER_INVENTORY_QUERY = gql(`
  query ProducerInventory($id: ID!) {
    Producer {
      producer(id: $id) {
        id
        wines {
          id
          name
          slug
          vintage
          varietal
        }
      }
    }
  }
`)

const PRODUCER_PROFILE_QUERY = gql(`
  query ProducerProfile($id: ID, $slug: String) {
    Producer {
      producer(id: $id, slug: $slug) {
        id
        name
        website
        email
        phone
        logo
        social {
          provider
          url
        }
      }
    }
  }
`)

const PRODUCER_PUBLIC_PAGE_QUERY = gql(`
  query ProducerPublicPage($id: ID, $slug: String) {
    Producer {
      producer(id: $id, slug: $slug) {
        id
        slug
        name
        description
        website
        email
        phone
        createdAt
        wineCount
        logo
        social {
          provider
          url
        }
        wines {
          id
          name
          slug
          vintage
          varietal
        }
      }
    }
  }
`)

const PRODUCERS_BY_AREA_QUERY = gql(`
  query DiscoverProducersByArea($areaId: ID!) {
    Producer {
      producers(areaId: $areaId) {
        id
        slug
        name
      }  
    }
  }
`)

// Create a new producer (onboarding) — matches schema ProducerMutation.addProducer
const ADD_PRODUCER = gql(`
  mutation AddProducer($producer: ProducerInput!) {
    Producer {
      addProducer(producer: $producer) {
        id
        slug
        name
        createdAt
        description
        email
        phone
        website
        social {
          provider
          url
        }
        logo
      }
    }
  }
`)

export {
  PRODUCER_MARKETPLACE_QUERY,
  PRODUCER_INVENTORY_QUERY,
  PRODUCER_PROFILE_QUERY,
  PRODUCER_PUBLIC_PAGE_QUERY,
  PRODUCERS_BY_AREA_QUERY,
  ADD_PRODUCER,
}
