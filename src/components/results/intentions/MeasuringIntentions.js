import React, { useEffect, useState } from "react"
import {
  clearIntentionsData,
  TEST,
} from "../../../utils/measuring-intentions.utils"
import { ACTION, CATEG, trackerClick } from "../../../utils/tracker.utils"
import { BeCloseToRealityQuestion } from "./BeCloseToRealityQuestion"
import * as Icon from "react-bootstrap-icons"
import { STORAGE_TEST_INTENTIONS } from "../../../constants/constants"
import { getInLocalStorage } from "../../../utils/main.utils"

const TEST_NUMBER_ENABLED = process.env.NEXT_PUBLIC_TEST_NUMBER_ENABLED

export const MeasuringIntentions = ({
  scoreLevel,
  setTestId,
  setTestStarted,
}) => {
  const [test, setTest] = useState()
  const [component, setComponent] = useState()
  const [showBackButton, setShowBackButton] = useState(false)

  useEffect(() => {
    const id =
      getInLocalStorage(STORAGE_TEST_INTENTIONS) ?? generateRandomTest()
    setTestId(id)
    setTest(id)
    localStorage.setItem(STORAGE_TEST_INTENTIONS, id)

    trackerClick(CATEG.test, `${ACTION.parcours}${id}`)
  }, [])

  useEffect(() => {
    clearIntentionsData()
    if (test != undefined && component == undefined) {
      updateComponent()
    }
  }, [test, component])

  useEffect(() => {
    setTestStarted(showBackButton)

    if (showBackButton) {
      updateComponent()
    }
  }, [showBackButton])

  const updateComponent = () => {
    const content = displayComponentsByTest({
      testId: test,
      scoreLevel: scoreLevel,
      onReset,
      showBackButton,
      setShowBackButton,
    })

    setComponent(content)
  }

  const onReset = () => {
    setComponent(undefined)
    setShowBackButton(false)
  }

  return (
    <div className="measure">
      {TEST_NUMBER_ENABLED === "true" ? <div>Test {test}</div> : null}
      {component}
    </div>
  )
}

const getRandomInt = (max) => {
  if (typeof window !== "undefined") {
    const randomArray = window.crypto.getRandomValues(new Uint16Array(1))
    const randomVal = randomArray[0]
    return randomVal % max
  }
}

const generateRandomTest = () => {
  // expected output: 0, 1 or 2
  switch (getRandomInt(3)) {
    case 0:
      return TEST.A
    case 1:
      return TEST.B
    case 2:
      return TEST.C
  }
}

export const displayComponentsByTest = ({
  testId,
  scoreLevel,
  onReset,
  showBackButton,
  setShowBackButton,
}) => {
  if (testId == TEST.B) {
    const contentTestB = (
      <BeCloseToRealityQuestion
        scoreLevel={scoreLevel}
        setShowBackButton={setShowBackButton}
      />
    )
    return cardComponentAndRetryButton(contentTestB, onReset, showBackButton)
  }

  if (testId == TEST.C) {
    const contentTestC = (
      <BeCloseToRealityQuestion
        scoreLevel={scoreLevel}
        displayMamanBlues={false}
        setShowBackButton={setShowBackButton}
      />
    )
    return cardComponentAndRetryButton(contentTestC, onReset, showBackButton)
  }

  return null
}

const cardComponentAndRetryButton = (content, onReset, showBackButton) => (
  <div className="measure-card">
    {showBackButton && (
      <button
        className="fr-btn fr-btn--tertiary-no-outline margin-bottom-8 measure-button-back"
        onClick={onReset}
      >
        <Icon.ChevronLeft className="margin-right-8" />
        Retour
      </button>
    )}
    {content}
  </div>
)
