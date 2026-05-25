import {gql} from "@apollo/client";

const DISCOVER_DOMAIN_QUERY = gql(`
  query DiscoverDomain {
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
              slug
            }
          }
        }
      }
    }
  }
`);

const PRODUCER_ONBOARDING_AREAS_QUERY = gql(`
  query ProducerOnboardingAreas {
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

const DOMAIN_AREA_PRODUCERS_QUERY = gql(`
  query DomainAreaProducers($areaId: ID!) {
    Domain {
      area(areaId: $areaId) {
        id
        producers {
          id
          name
          slug
          wineCount
        }
      }
    }
  }
`)

const DOMAIN_AREA_WINE_MATCHES_QUERY = gql(`
  query DomainAreaWineMatches($areaId: ID!) {
    Domain {
      area(areaId: $areaId) {
        id
        producers {
          id
          wines {
            id
            name
            slug
            varietal
            vintage
            matchCount
          }
        }
      }
    }
  }
`)

export {
  DISCOVER_DOMAIN_QUERY,
  PRODUCER_ONBOARDING_AREAS_QUERY,
  DOMAIN_AREA_PRODUCERS_QUERY,
  DOMAIN_AREA_WINE_MATCHES_QUERY,
};
