import { STORAGE_TEST_ABC, STORAGE_RESULTS_ID } from "../../constants/constants"
import { TEST } from "./ab-testing.utils"
import * as StorageUtils from "../storage.utils"

export const genderValues = [
  {
    id: "femme",
    text: "Femme",
    isChecked: false,
  },
  {
    id: "homme",
    text: "Homme",
    isChecked: false,
  },
  {
    id: "nonPrecise",
    text: "Non précisé",
    isChecked: false,
  },
]

export const ageValues = [
  {
    id: "moinsDe18ans",
    text: "-18 ans",
    isChecked: false,
  },
  {
    id: "entre18_25ans",
    text: "18 - 25 ans",
    isChecked: false,
  },
  {
    id: "entre25_30ans",
    text: "25 - 30 ans",
    isChecked: false,
  },
  {
    id: "entre30_35ans",
    text: "30 - 35 ans",
    isChecked: false,
  },
  {
    id: "entre35_40ans",
    text: "35 - 40 ans",
    isChecked: false,
  },
  {
    id: "entre40_45ans",
    text: "40 - 45 ans",
    isChecked: false,
  },
  {
    id: "plusDe45ans",
    text: "45 ans et +",
    isChecked: false,
  },
]

export const situationValues = [
  {
    id: "vousAttendez1Enfant",
    text: "J'attends un enfant",
    isChecked: false,
  },
  {
    id: "vousAvezEnfantDeMoinsDe1an",
    text: "J'ai un enfant de moins d' 1 an",
    isChecked: false,
  },
  {
    id: "vousAvezEnfantDeMoinsDe2ans",
    text: "J'ai un enfant de moins de 2 ans",
    isChecked: false,
  },
  {
    id: "vousAvezDesEnfantsDePlusDe2ans",
    text: "J'ai un ou plusieurs enfants de plus de 2 ans",
    isChecked: false,
  },
  {
    id: "vousAvezPerduUnEnfant",
    text: "J'ai perdu un enfant",
    isChecked: false,
  },
]

export const availableRelativesValues = [
  {
    id: "oui",
    text: "Oui",
    isChecked: false,
  },
  {
    id: "non",
    text: "Non",
    isChecked: false,
  },
  {
    id: "jeNeSaisPas",
    text: "Je ne sais pas",
    isChecked: false,
  },
]

export const convertArraySituationsToString = (situations) => {
  let situationsString = ""
  situations.forEach((element) => {
    situationsString += `${situationsString.length > 0 ? " / " : ""}${
      element.text
    }`
  })

  return situationsString
}

/**
 * @returns renvoie les nouveaux labels des boutons
 */
export const uiAdaptationForInfoDemographic = () => {
  const test = StorageUtils.getInLocalStorage(STORAGE_TEST_ABC)
  if (test === TEST.B) {
    return {
      isBeforeEpds: true,
      buttonLabelInBeforeSurvey: "Suivant",
      buttonLabelInInfoDemographicSurvey:
        "Envoyer et commencer le questionnaire",
    }
  }
  if (test === TEST.C) {
    return {
      isAfterEpds: true,
      buttonLabelInInfoDemographicSurvey:
        "Envoyer et afficher le résultat du questionnaire",
    }
  }

  return null
}

export const getDemographicBeforeEpds = () => {
  return {
    isBeforeEpds: true,
    buttonLabelInBeforeSurvey: "Suivant",
    buttonLabelInInfoDemographicSurvey: "Envoyer et commencer le questionnaire",
  }
}

export const goToDemographicSurvey = async (router, epdsTestID) => {
  if (epdsTestID) localStorage.setItem(STORAGE_RESULTS_ID, epdsTestID)

  router.push({ pathname: "/ab-testing/demographic-data-survey" })
}
