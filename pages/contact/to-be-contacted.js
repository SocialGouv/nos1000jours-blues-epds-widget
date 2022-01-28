import React, { useEffect, useState } from "react"
import { ContentLayout } from "../../src/components/Layout"
import { } from "@dataesr/react-dsfr"
import { ButtonGroup, Col, Row, ToggleButton } from "react-bootstrap"
import { useRouter } from "next/router"
import {
  RequestContact,
  STORAGE_CONTACT_HOURS,
  STORAGE_CONTACT_TYPE,
} from "../../src/constants/constants"

export default function ToBeContacted() {
  const router = useRouter()

  const [contactType, setContactType] = useState(defaultContactTypes)
  const [contactHours, setContactHours] = useState(defaultContactHours)

  const [itemValueType, setItemValueType] = useState()
  const [itemValueHours, setItemValueHours] = useState()
  const [isSmsSelected, setSmsSelected] = useState(false)

  const isValidButtonEnabled = () =>
    itemValueType == RequestContact.type.email ||
    (itemValueType == RequestContact.type.sms && itemValueHours)

  useEffect(() => {
    setSmsSelected(itemValueType == RequestContact.type.sms)
  }, [itemValueType])

  const cancel = () => {
    router.back()
  }

  const goToContactForm = async (event) => {
    localStorage.setItem(STORAGE_CONTACT_TYPE, itemValueType)
    localStorage.setItem(STORAGE_CONTACT_HOURS, itemValueHours)

    router.push({
      pathname: "/contact/contact-form",
    })
  }

  const ButtonGroupType = () => (
    <ButtonGroup className="be-contacted-button-group">
      {contactType.map((type, idx) => (
        <ToggleButton
          className="contact-card"
          key={idx}
          id={`radio-type-${idx}`}
          type="radio"
          name="radio-type"
          value={type.id}
          checked={itemValueType === type.id}
          onChange={(e) => setItemValueType(e.currentTarget.value)}
        >
          <Row style={{ justifyContent: "center" }}>
            <img
              alt=""
              src={itemValueType === type.id ? type.iconSelected : type.icon}
              height={50}
            />
            {type.text}
          </Row>
        </ToggleButton>
      ))}
    </ButtonGroup>
  )

  const ButtonGroupHours = () => (
    <ButtonGroup className="be-contacted-button-group">
      {contactHours.map((type, idx) => (
        <ToggleButton
          className="contact-card"
          key={idx}
          id={`radio-hours-${idx}`}
          type="radio"
          name="radio-hours"
          value={type.id}
          checked={itemValueHours === type.id}
          onChange={(e) => setItemValueHours(e.currentTarget.value)}
        >
          <Row style={{ justifyContent: "center" }}>
            <img
              alt=""
              src={itemValueHours === type.id ? type.iconSelected : type.icon}
              height={50}
            />
            {type.text}
          </Row>
        </ToggleButton>
      ))}
    </ButtonGroup>
  )

  return (
    <ContentLayout>
      <h5 className="title-ddp">être contacté(e)</h5>
      <p>
        Se rendre disponible en tant que parent n'est pas toujours simple. Nous
        vous proposons de choisir le créneau et le type de prise de contact qui
        vous conviennent.
      </p>
      <p>Par quel moyen préférez-vous être contacté(e) ?</p>
      <ButtonGroupType />

      {isSmsSelected ? (
        <>
          <p>
            Quelles sont vos disponibilités pour être contacté(e) ? (du lundi au vendredi)
          </p>
          <ButtonGroupHours />
        </>
      ) : null}

      <Col className="be-contacted-bottom-buttons">
        <button className="fr-btn fr-btn--secondary" onClick={cancel}>
          Annuler
        </button>
        <button
          className="fr-btn"
          disabled={!isValidButtonEnabled()}
          onClick={goToContactForm}
        >
          Valider
        </button>
      </Col>
    </ContentLayout>
  )
}

const defaultContactTypes = [
  {
    icon: "../img/contact/sms.svg",
    iconSelected: "../img/contact/sms-selected.svg",
    id: RequestContact.type.sms,
    isChecked: false,
    text: "Par SMS",
  },
  {
    icon: "../img/contact/email-contact.svg",
    iconSelected: "../img/contact/email-contact-selected.svg",
    id: RequestContact.type.email,
    isChecked: false,
    text: "Par email",
  },
]

const defaultContactHours = [
  {
    hours: "9h - 12h",
    icon: "../img/contact/soleil-matin.svg",
    iconSelected: "../img/contact/soleil-matin-selected.svg",
    id: RequestContact.hours.morning,
    isChecked: false,
    text: "En matinée",
  },
  {
    hours: "12h - 14h",
    icon: "../img/contact/soleil-midi.svg",
    iconSelected: "../img/contact/soleil-midi-selected.svg",
    id: RequestContact.hours.noon,
    isChecked: false,
    text: "Le midi",
  },
  {
    hours: "14h - 17h30",
    icon: "../img/contact/soleil-soir.svg",
    iconSelected: "../img/contact/soleil-soir-selected.svg",
    id: RequestContact.hours.afternoon,
    isChecked: false,
    text: "L'après-midi",
  },
]
