import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { ContentLayout } from "../../src/components/Layout"
import {
  RequestContact,
  STORAGE_CONTACT_TYPE,
} from "../../src/constants/constants"
import { } from "@dataesr/react-dsfr"
import { WidgetHeader } from "../../src/components/WidgetHeader"
import {
  getInLocalStorage,
  getLocaleInLocalStorage,
} from "../../src/utils/main.utils"
import {
  CATEG,
  CONTACT_SENT,
  trackerClick,
} from "../../src/utils/tracker.utils"

export default function ContactConfirmed() {
  const router = useRouter()

  const contactType = getInLocalStorage(STORAGE_CONTACT_TYPE)
  const localeSelected = getLocaleInLocalStorage()

  const confirmedImage = (contactType) => (
    <img
      alt=""
      src={
        contactType == RequestContact.type.email
          ? "../img/contact/email-sent.svg"
          : "../img/contact/sms-sent.svg"
      }
      height={100}
    />
  )

  const goToResults = () => {
    router.push({
      pathname: "/results",
    })
  }

  useEffect(() => {
    let name
    switch (contactType) {
      case RequestContact.type.email:
        name = CONTACT_SENT.mail
        break
      case RequestContact.type.sms:
        name = CONTACT_SENT.sms
        break
    }

    trackerClick(
      CATEG.contact,
      "Confirmation d'envoi de la demande de contact",
      name
    )
  }, [])

  return (
    <ContentLayout>
      <WidgetHeader title="être contacté(e)" locale={localeSelected} />
      <div className="contact-confirmed">
        {confirmedImage(contactType)}
        <p className="contact-confirmed-title">Demande envoyée</p>
        <p>
          <b>Votre demande de contact a bien été prise en compte.</b>
        </p>
        <p>
          {contactType == RequestContact.type.email
            ? "Vous devriez recevoir un email d’Elise dans les 48h. Pensez bien à vérifier dans vos spams."
            : "Vous devriez recevoir un SMS d’Elise dans les 48h en fonction des disponibilités sélectionnées."}
        </p>

        <button className="fr-btn" onClick={goToResults}>
          Retour à mon résultat
        </button>
      </div>
    </ContentLayout>
  )
}
