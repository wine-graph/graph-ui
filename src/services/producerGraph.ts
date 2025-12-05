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

const WINE_BY_ID = gql(`
  query($id: ID!) {
    Wine {
      wine(id: $id) {
        id
        name
        slug
        description
        varietal
        vintage
        alcohol
        producer
        color
        closure
        type
        shape
      }
    }
  }
`)

export {PRODUCERS_QUERY, PRODUCER_BY_ID, WINE_BY_ID, PRODUCERS_BY_AREA}