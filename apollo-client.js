import { ApolloClient, gql, InMemoryCache, HttpLink } from "@apollo/client"

import { API_URL } from "./src/constants/constants"
import fetch from "cross-fetch"

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  headers: { "content-type": "application/json" },
  link: new HttpLink({ uri: `${API_URL}/graphql?nocache`, fetch }),
})

export const EPDS_CONTACT_INFORMATION = gql`
  mutation (
    $email: String
    $telephone: String
    $prenom: String
    $nombreEnfants: Int
    $naissanceDernierEnfant: String
    $moyen: String
    $horaires: String
  ) {
    epdsContact(
      email: $email
      telephone: $telephone
      prenom: $prenom
      nombre_enfants: $nombreEnfants
      naissance_dernier_enfant: $naissanceDernierEnfant
      moyen: $moyen
      horaires: $horaires
    )
  }
`

export const GET_TEMOIGNAGES_CHIFFRES = gql`
  query temoignages {
    temoignages {
      titre
      texte
      chiffre_choc
      source
    }
  }
`

export const GET_RESUTLATS_COUNT = gql`
  query resultatsCount {
    reponsesEpdsConnection {
      aggregate {
        count
      }
    }
  }
`

export const INFORMATION_DEMOGRAPHIQUES = gql`
  mutation (
    $genre: String
    $age: String
    $entourageDispo: String
    $situation: String
    $codePostal: Int
    $ville: String
    $departement: Int
    $region: String
    $reponsesEpds: ID
  ) {
    createInformationsDemographique(
      input: {
        data: {
          genre: $genre
          age: $age
          entourage_dispo: $entourageDispo
          situation: $situation
          code_postal: $codePostal
          ville: $ville
          departement: $departement
          region: $region
          reponses_epds: $reponsesEpds
        }
      }
    ) {
      informationsDemographique {
        id
        created_at
      }
    }
  }
`
