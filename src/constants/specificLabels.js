export const Labels = {
  titleDPP: "Mon résultat",
  titleSurvey: "Comment ça va cette semaine ?",
  surveyExplanations:
    "Veuillez cocher la réponse qui vous semble décrire le mieux comment vous vous êtes senti(e) au cours des 7 derniers jours et pas seulement aujourd’hui.",
  mood: {
    good: "Je vais bien",
    moderatelyGood: "Je vais moins bien",
    notGood: "Je ne vais pas bien",
  },
}

const descriptionLvl2 =
  "Les changements importants liés à l’arrivée d’un bébé sont des facteurs de stress dont certains signes peuvent évoquer ceux de la dépression post partum. Vous exprimez des signes évocateurs de la dépression post partum, il est donc nécessaire d'échanger avec un professionnel de santé. Demandez de l'aide à un membre de notre équipe, ou consultez notre page des ressources."
export const EpdsResultsComments = {
  level1: {
    description:
      "Les changements importants liés à l’arrivée d’un bébé sont des facteurs de stress dont certains signes évocateurs sont normaux durant cette période. Parlez de vos difficultés des premiers mois est essentiel pour que le professionnel de santé qui vous suit puisse à tout moment vous accompagner. Des aides et un accompagnement peuvent être mis en place pour vous aider durant cette période qui nécessite du soutien. En parler avec un professionnel de santé et votre entourage, c’est se soigner. Parce que vous n’êtes pas seul(e) et qu’en parler a permis à de nombreux parents d’aller mieux.",
    conclusion:
      "Nous vous invitons à vous questionner de nouveau dans les 14 jours.",
  },
  level2: {
    description: descriptionLvl2,
    conclusion: "",
  },
  level3: {
    description: descriptionLvl2,
    conclusion: "",
  },
}

export const Form = {
  placeholder: {
    name: "Écrivez ici votre prénom",
    email: "Écrivez ici l’adresse mail",
  },
  error: {
    email: "L'adresse mail n'est pas au bon format",
  },
  required: "*Champs obligatoire",
}
