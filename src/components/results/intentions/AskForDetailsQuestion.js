import { useEffect, useState } from "react"
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap"
import {
  SCORE_LEVEL_BAD,
  SCORE_LEVEL_MEDIUM,
} from "../../../utils/score-level.utils"
import { ContactMamanBlues } from "../ContactMamanBlues"
import { FormToSendMail } from "./FormToSendMail"
import { TextAreaToSendDetails } from "./TextAreaToSendDetails"

const DETAILS_TYPE = {
  TEXTE: "text",
  TEXT_AREA: "text_area",
  FORM: "form",
}

export const AskForDetailsQuestion = ({
  scoreLevel,
  displayMamanBlues = true,
  data,
}) => {
  const [askForDetails, setAskForDetails] = useState("")
  const [displayMore, setDisplayMore] = useState()
  const [displayItemSelected, setDisplayItemSelected] = useState(false)

  useEffect(() => {
    switch (getDetailsTypeByValue(askForDetails.value)) {
      case DETAILS_TYPE.TEXTE:
        setDisplayItemSelected(true)
        setDisplayMore(
          <div>
            <div className="measure-label-selected">{askForDetails.label}</div>
            {data.commentaires[askForDetails.value]}
            {displayMamanBlues && askForDetails.value !== "proSante" && (
              <ContactMamanBlues scoreLevel={scoreLevel} />
            )}
          </div>
        )
        break
      case DETAILS_TYPE.TEXT_AREA:
        setDisplayItemSelected(true)
        setDisplayMore(
          <div>
            <div className="measure-label-selected">{askForDetails.label}</div>
            {data.commentaires[askForDetails.value]}
            <TextAreaToSendDetails
              scoreLevel={scoreLevel}
              displayMamanBlues={
                displayMamanBlues &&
                (scoreLevel == SCORE_LEVEL_MEDIUM ||
                  scoreLevel == SCORE_LEVEL_BAD)
              }
            />
          </div>
        )
        break
      case DETAILS_TYPE.FORM:
        setDisplayItemSelected(true)
        setDisplayMore(
          <div>
            <div className="measure-label-selected">{askForDetails.label}</div>
            <FormToSendMail
              scoreLevel={scoreLevel}
              forHimself={askForDetails.value === "quiJoindre"}
              displayMamanBlues={displayMamanBlues}
            />
          </div>
        )
        break
    }
  }, [askForDetails])

  const getDetailsTypeByValue = (value) => {
    switch (value) {
      case "mal":
      case "seTourner":
      case "bien":
      case "curiosite":
      case "proSante":
        return DETAILS_TYPE.TEXTE
      case "autre":
      case "aucune":
        return DETAILS_TYPE.TEXT_AREA
      case "quiJoindre":
      case "quoiFaire":
        return DETAILS_TYPE.FORM
    }
  }

  return (
    <div>
      {data.question}
      {!displayItemSelected && (
        <div className="buttons-bloc">
          <ToggleButtonGroup type="radio" name="radio-details">
            {data.reponses.map((item, index) => (
              <ToggleButton
                className="measure-button"
                key={index}
                value={item.value}
                onClick={() => setAskForDetails(item)}
              >
                {convertStringWithfirstPartInBold(":", item.label)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
      )}
      {displayMore}
    </div>
  )
}

const convertStringWithfirstPartInBold = (character, label) => {
  const result = label.split(character)

  return result.length > 1 ? (
    <div>
      <b>{result[0]}</b> {character} {result[1]}
    </div>
  ) : (
    <div>{label}</div>
  )
}
