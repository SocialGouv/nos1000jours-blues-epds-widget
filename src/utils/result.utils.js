import {
  STORAGE_RESULTS_BOARD,
  STORAGE_SCORE_LEVEL_MOOD,
} from "../constants/constants"
import * as StorageUtils from "../utils/storage.utils"
import { getColorIconAndTextByMood, jsonParse } from "./main.utils"

export const getEpdsResultsAndMoodInStorage = () => {
  const resultsBoard = jsonParse(
    StorageUtils.getInLocalStorage(STORAGE_RESULTS_BOARD)
  )
  const moodId = parseInt(
    StorageUtils.getInLocalStorage(STORAGE_SCORE_LEVEL_MOOD)
  )

  return {
    detailQuestions: resultsBoard
      ? resultsBoard.map((data) => data.question)
      : null,
    detailReponses: resultsBoard
      ? resultsBoard.map((data) => data.response)
      : null,
    moodLabel: getColorIconAndTextByMood(moodId).moodText,
  }
}

export const convertResultsInStorageToContentTable = (resultsBoard) => {
  return resultsBoard.detailQuestions.map((questionItem, index) => {
    return {
      question: questionItem,
      reponse: resultsBoard.detailReponses[index],
    }
  })
}
