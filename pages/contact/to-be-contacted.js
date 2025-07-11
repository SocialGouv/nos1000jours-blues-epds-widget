import React, { useEffect, useState } from "react"
import {} from "@dataesr/react-dsfr"
import { useRouter } from "next/router"
import {
  ButtonGroup,
  Col,
  Row,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap"

import { ContentLayout } from "../../src/components/Layout"
import {
  OPEN_CONTACT_FROM_EMAIL,
  RequestContact,
  STORAGE_CONTACT_HOURS,
  STORAGE_CONTACT_TYPE,
  STORAGE_SOURCE,
} from "../../src/constants/constants"
import { WidgetHeader } from "../../src/components/WidgetHeader"
import {
  readSourceInUrl,
  updateRadioButtonSelectedInList,
} from "../../src/utils/main.utils"
import _ from "lodash"

import { ContactForm } from "../../src/components/contact/ContactForm"
import * as StorageUtils from "../../src/utils/storage.utils"
import * as TrackerUtils from "../../src/utils/tracker.utils"
import * as ContactUtils from "../../src/utils/contact.utils"
import { useQuery } from "@apollo/client"
import { client, GET_ACTIVATION_TILE_STATUS } from "../../apollo-client"

export default function ToBeContacted() {
  const router = useRouter()

  const localeSelected = StorageUtils.getLocaleInLocalStorage()

  const [contactHours, setContactHours] = useState(defaultContactHours)
  const [itemValueType, setItemValueType] = useState()
  const [isSmsSelected, setSmsSelected] = useState(false)
  const [isWhatsappSelected, setWhatsappSelected] = useState(false)
  const [isPhoneValid, setIsPhoneValid] = useState(false)
  const [isPhoneConfirmValid, setIsPhoneConfirmValid] = useState(false)
  const [websiteSource, setWebsiteSource] = useState(false)
  const [canSend, setCanSend] = useState(false)

  useEffect(() => {
    const source = readSourceInUrl()
    if (source) {
      localStorage.setItem(STORAGE_SOURCE, source)
      setWebsiteSource(source)
    }
  }, [])

  useEffect(() => {
    setCanSend(isValidForm(itemValueType, isPhoneValid && isPhoneConfirmValid))
  }, [isPhoneValid, isPhoneConfirmValid])

  useEffect(() => {
    setSmsSelected(itemValueType == RequestContact.type.sms)
    setWhatsappSelected(itemValueType == RequestContact.type.whatsapp)
  }, [itemValueType])

  const cancel = () => {
    TrackerUtils.trackerForContact(TrackerUtils.ACTION.abandon)
    router.back()
  }

  const goToContactValidation = (path) => {
    localStorage.setItem(STORAGE_CONTACT_TYPE, itemValueType)
    localStorage.setItem(
      STORAGE_CONTACT_HOURS,
      convertHoursListInString(contactHours)
    )

    router.push({
      pathname: path,
    })
  }

  const onClickSelector = (type) => {
    TrackerUtils.trackerForContact("Choix effectué")
    TrackerUtils.trackerForContact("Choix " + type.id)
  }

  const sendTrackerContactType = (typeContact) => {
    if (typeContact) {
      TrackerUtils.trackerForContact(TrackerUtils.ACTION.confirmation)
      TrackerUtils.trackerForContact(
        ContactUtils.trackerContactName(typeContact)
      )
    }
  }

  const onValidate = () => {
    if (itemValueType === RequestContact.type.sms) {
      sendTrackerContactType(itemValueType)
      goToContactValidation("/contact/contact-confirmed")
    }
    if (itemValueType === RequestContact.type.whatsapp) {
      sendTrackerContactType(itemValueType)
      goToContactValidation("/contact/contact-confirmed")
    } else if (itemValueType === RequestContact.type.rendezvous) {
      TrackerUtils.trackerForContact("Choix effectué")
      TrackerUtils.trackerForContact("Choix rendezvous")
      goToContactValidation("/contact/contact-form")
    }
  }

  const CustomToggleButton = (type) => (
    <ToggleButton
      className="contact-card"
      key={type.id}
      id={`radio-type-${type.id}`}
      type="radio"
      name="radio-type"
      value={type.id}
      checked={itemValueType === type.id}
      onChange={(e) => {
        setItemValueType(e.currentTarget.value)
        onClickSelector(type)
      }}
    >
      <Row className="card-center-img">
        <img
          alt=""
          src={itemValueType === type.id ? type.iconSelected : type.icon}
          height={50}
        />
        {type.text}
      </Row>
    </ToggleButton>
  )

  const SmsComponent = () => (
    <fieldset>
      <Row>
        {defaultContactTypes.byAvailabilities.map((type) => (
          <Col key={type.id}>{CustomToggleButton(type)}</Col>
        ))}
      </Row>
    </fieldset>
  )

  const WhatsappComponent = () => (
    <fieldset>
      <Row>
        {defaultContactTypes.byWhatsapp.map((type) => (
          <Col key={type.id}>{CustomToggleButton(type)}</Col>
        ))}
      </Row>
    </fieldset>
  )

  const CalendlyComponent = () => {
    return (
      <>
        <Row>
          {defaultContactTypes.byAppointment.map((type) => (
            <Col key={type.id}>{CustomToggleButton(type)}</Col>
          ))}
        </Row>
      </>
    )
  }

  const ButtonGroupType = (params) => {
    const _activationTile = params.activationTile
    if (_activationTile) {
      return (
        <ButtonGroup className="be-contacted-button-group">
          <Col>
            {activationTile.rdv ? <CalendlyComponent /> : null}
            {activationTile.sms ? <SmsComponent /> : null}
            {activationTile.whatsapp ? <WhatsappComponent /> : null}
          </Col>
        </ButtonGroup>
      )
    }
    return (
      <ButtonGroup className="be-contacted-button-group">
        <Col>
          <CalendlyComponent />
          <SmsComponent />
        </Col>
      </ButtonGroup>
    )
  }

  const buttonGroupHours = () => (
    <ToggleButtonGroup
      type="checkbox"
      className="be-contacted-button-group-checkbox"
    >
      {contactHours.map((type, idx) => (
        <ToggleButton
          className="contact-card"
          key={idx}
          id={`checkbox-hours-${idx}`}
          type="checkbox"
          name="checkbox-hours"
          value={type.id}
          onChange={(_e) => {
            setContactHours(updateRadioButtonSelectedInList(contactHours, type))
          }}
        >
          <Row className="card-center-img">
            <img
              alt=""
              src={type.isChecked ? type.iconSelected : type.icon}
              height={50}
            />
            {type.text}
          </Row>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )

  const PersonalizedTile = ({ imageUrl, title }) => {
    return (
      <div className="fr-tile fr-enlarge-link card-space card-text ">
        <div className="fr-tile__body padding-tile">
          <div className="fr-tile__img tile-image padding-image">
            <img src={imageUrl} className="fr-responsive-img" alt="" />
          </div>
          <div>
            <h4 className="fr-tile__title">{title}</h4>
          </div>
        </div>
      </div>
    )
  }

  const { loading, error, data } = useQuery(GET_ACTIVATION_TILE_STATUS, {
    client: client,
  })

  if (loading) return <></>
  if (error) return <p>Error</p>
  const activationTile = data.activationTile

  return (
    <ContentLayout>
      <WidgetHeader title="Je veux être accompagné.e" locale={localeSelected} />
      <PersonalizedTile
        title="Avec Wanda, infirmière spécialisée en périnatalité, et ensemble nous trouvons une aide adaptée à ma situation."
        imageUrl="/img/image-wanda.png"
      />
      <p>Je préfére être contacté.e par :</p>
      <ButtonGroupType activationTile={activationTile} />

      {isSmsSelected ? (
        <>
          <div className="margin-bottom-8">
            Quelles sont vos disponibilités pour être contacté(e) ? (du lundi au
            vendredi)
          </div>
          {buttonGroupHours()}
          <ContactForm
            contactType={itemValueType}
            setPropsPhoneValid={setIsPhoneValid}
            setPropsPhoneConfirmValid={setIsPhoneConfirmValid}
            canSend={canSend}
            contactHours={contactHours}
          />
        </>
      ) : null}
      {isWhatsappSelected ? (
        <>
          <ContactForm
            contactType={itemValueType}
            setPropsPhoneValid={setIsPhoneValid}
            setPropsPhoneConfirmValid={setIsPhoneConfirmValid}
            canSend={canSend}
            contactHours={contactHours}
          />
        </>
      ) : null}
      {!isSmsSelected && !isWhatsappSelected && (
        <Col className="be-contacted-bottom-buttons">
          {websiteSource !== OPEN_CONTACT_FROM_EMAIL && (
            <button className="fr-btn fr-btn--secondary" onClick={cancel}>
              Annuler
            </button>
          )}
          <button
            className="fr-btn"
            type="submit"
            disabled={
              !isValidButtonEnabled(itemValueType, contactHours, canSend)
            }
            onClick={onValidate}
          >
            Valider
          </button>
        </Col>
      )}
    </ContentLayout>
  )
}

const defaultContactTypes = {
  byWhatsapp: [
    {
      icon: "../img/contact/chat.svg",
      iconSelected: "../img/contact/chat-selected.svg",
      id: RequestContact.type.whatsapp,
      isChecked: false,
      text: "Whatsapp",
    },
  ],
  byAvailabilities: [
    {
      icon: "../img/contact/sms.svg",
      iconSelected: "../img/contact/sms-selected.svg",
      id: RequestContact.type.sms,
      isChecked: false,
      text: "SMS",
    },
  ],
  byAppointment: [
    {
      icon: "../img/contact/appel.svg",
      iconSelected: "../img/contact/appel-selected.svg",
      id: RequestContact.type.rendezvous,
      text: "Entretien téléphonique",
    },
  ],
}

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

/**
 * @param {Array} hours Tableau des heures
 * @returns La liste des heures au format String
 */
export const convertHoursListInString = (hours) =>
  hours.reduce(
    (hoursString, hour) =>
      hour.isChecked ? `${hoursString} ${hour.id}` : hoursString,
    ""
  )

/**
 * @param {RequestContact.type} itemValueType Type du mode de contact sélectionné (RDV/ SMS)
 * @param {Array} contactHours Tableau des heures
 * @returns boolean de la validité des choix seléctionnés
 */
export const isValidButtonEnabled = (itemValueType, contactHours, canSend) => {
  const isHoursSelected =
    contactHours?.find((item) => item.isChecked) != undefined

  return (
    itemValueType == RequestContact.type.rendezvous ||
    (itemValueType == RequestContact.type.sms && isHoursSelected && canSend) ||
    (itemValueType == RequestContact.type.whatsapp && canSend)
  )
}

const isValidForm = (contactType, isPhoneValid) => {
  if (
    contactType == RequestContact.type.sms ||
    contactType == RequestContact.type.whatsapp
  ) {
    return isPhoneValid
  }
  return false
}
