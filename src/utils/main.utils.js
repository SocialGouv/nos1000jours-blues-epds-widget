import { Spinner } from "react-bootstrap"
import { Labels } from "../constants/specificLabels"
import Moment from "moment"
import "moment/locale/fr"

/**
 * Permet de récupérer en une seule fois : couleur, texts et icone pour un mood
 * @param {*} scoreLevel Niveau obtenu avec la fonction scoreLevelForMood
 * @returns Les informations d'un mood (couleur, texts et icone) en fonction du niveau
 */
export const getColorIconAndTextByMood = (scoreLevel) => {
  let icon
  let text
  let color

  switch (scoreLevel) {
    case 1:
      icon = "icone-resultats-bien.svg"
      text = Labels.mood.good
      color = "good-mood"
      break
    case 2:
      icon = "icone-resultats-moyen.svg"
      text = Labels.mood.moderatelyGood
      color = "moderatelygood-mood"
      break
    case 3:
      icon = "icone-resultats-pasbien.svg"
      text = Labels.mood.notGood
      color = "bad-mood"
      break
    default:
      break
  }

  return {
    moodIcon: icon,
    moodText: text,
    moodColor: color,
  }
}

export function jsonParse(data) {
  if (typeof data !== "undefined") return JSON.parse(data)
}

export const stringIsNotNullNorEmpty = (str) =>
  str !== null && str !== undefined && str.length > 0

export function convertArrayLabelsToObject(data) {
  const labels = {}
  data?.forEach((item) => (labels[item.label.toLowerCase()] = item.texte))
  return labels
}

export const phoneNumberFormatting = (phoneNumber) => {
  return phoneNumber.replace(/(.{2})(?!$)/g, "$1 ")
}

export const LoaderFoButton = () => (
  <Spinner animation="border" size="sm" className="margin-start-10" />
)

export const convertStringWithfirstPartInBold = (character, label) => {
  const result = label.split(character)

  return result.length > 1 ? (
    <div>
      <b>
        {result[0]} {character}
      </b>{" "}
      {result[1]}
    </div>
  ) : (
    <div>{label}</div>
  )
}

/**
 * @param {Date} date
 * @param {String} separator
 * @returns date in String
 */
export const convertDateToString = (date, separator) => {
  return Moment(date).locale("fr").format("L").replace(/\//g, separator)
}

/**
 * @param {Date} date
 * @returns date in ISO String
 */
export const convertDateToISO = (date) => {
  return Moment(date).locale("fr").format("YYYY-MM-DD")
}

export const readSourceInUrl = () => {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())
  return params.source
}

/**
 * Pour les groupes de boutons radio : permet de mettre à jour la valeur `isChecked` de l'item sélectionné
 * @param {Array} list liste des items
 * @param {*} itemSelected l'item sélectionné
 * @returns Liste mise à jour avec l'item sélectionné
 */
export const updateRadioButtonSelectedInList = (list, itemSelected) =>
  list.map((item) => {
    if (item.id === itemSelected.id) {
      return { ...item, isChecked: !itemSelected.isChecked }
    }

    return item
  })

export const openUrl = (url) => {
  window.open(url, "_blank")
}

/**
 * @param {number} max
 * @returns between 0 and max-1
 */
export const getRandomInt = (max) => {
  if (typeof window !== "undefined") {
    const randomArray = window.crypto.getRandomValues(new Uint16Array(1))
    const randomVal = randomArray[0]
    return randomVal % max
  }
}
