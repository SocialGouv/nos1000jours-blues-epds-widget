import React from "react"
import { Row } from "react-bootstrap"
import { } from "@dataesr/react-dsfr"
import { useRouter } from "next/router"
import * as TrackerUtils from "../../utils/tracker.utils"

export function ContactMamanBlues({ scoreLevel }) {
  const router = useRouter()
  let colorsByLevel

  switch (scoreLevel) {
    case 1:
      colorsByLevel = "good-mood"
      break
    case 2:
      colorsByLevel = "moderatelygood-mood"
      break
    case 3:
      colorsByLevel = "bad-mood"
      break
    default:
      break
  }

  const goToBeContacted = async (event) => {
    TrackerUtils.trackerClick(
      TrackerUtils.CATEG.contact,
      `Macaron d'Elise ${TrackerUtils.EVENT_CLICK}`,
      "Être contacté(e)"
    )

    router.push({
      pathname: "/contact/to-be-contacted",
    })
  }

  return (
    <div className="contact-mamanblues">
      <Row className={`contact-content ${colorsByLevel}`}>
        <div className="content-img-descr">
          <img
            alt="Portrait d'Elise : présidente de l'association Maman Blues"
            src="../img/portrait-elise.jpg"
          />
          <div className="mamanblues-description">
            <b>Trouvez un accompagnement personnalisé près de chez vous </b>
            auprès de professionnels sensibilisés aux difficultés maternelles en
            échangeant avec Elise, présidente de l’association Maman Blues
          </div>
        </div>
        <button className="fr-btn" onClick={goToBeContacted}>
          être contacté(e)
        </button>
      </Row>
    </div>
  )
}
