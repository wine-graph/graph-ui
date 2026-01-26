import {gql} from "@apollo/client";

const PRODUCERS_QUERY = gql(`
  query {
    Producer {
      producers {
        id
        slug
        name
        description
        email
        phone
        website
        wines {
          id
          name
          slug
        }
      }
    }
  }
`)

const PRODUCER_BY_ID = gql(`
  query($id: ID!) {
    Producer {
      producer(id: $id) {
        id
        slug
        name
        description
        email
        phone
        wines {
          id
          name
          slug
          vintage
          color
          varietal
        }
      }
    }
  }
`)

const PRODUCERS_BY_AREA = gql(`
  query($areaId: ID!) {
    Producer {
      producers(areaId: $areaId) {
        id
        slug
        name
        description
        email
        phone
        website
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
        description
        email
        phone
        website
      }
    }
  }
`)

export {PRODUCERS_QUERY, PRODUCER_BY_ID, PRODUCERS_BY_AREA, ADD_PRODUCER}