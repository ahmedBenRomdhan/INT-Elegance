const nodeMailer = require("nodemailer");

/* Send User Auth */
const sendUserAuth = async (firstName, lastName, email, password) => {
  let transporter = nodeMailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const capitalizeFirstName = await capitalizeName(firstName);
  const capitalizeLastName = await capitalizeName(lastName);

  let mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Welcome to INT-Elegance",
    text:
      `Bonjour ${capitalizeFirstName} ${capitalizeLastName},\n\n` +
      "Félicitations ! Votre compte INT-Elegance a été créé.\n" +
      "Voici vos informations de connexion :\n" +
      "Email : " +
      email +
      "\n" +
      "Mot de passe : " +
      password +
      "\n\n" +
      "Cordialement,\n",
  };
  transporter.sendMail(mailOptions);
};

/* Send User New Password*/
const sendUserNewPassword = async (firstName, lastName, email, password) => {
  let transporter = nodeMailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const capitalizeFirstName = await capitalizeName(firstName);
  const capitalizeLastName = await capitalizeName(lastName);

  let mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Mot de passe modifié",
    text:
      `Bonjour ${capitalizeFirstName} ${capitalizeLastName},\n\n` +
      "Vous avez mis à jour votre mot de passe.\n" +
      "Voici votre nouveau mot de passe : " +
      password +
      "\n\n" +
      "Cordialement,\n",
  };
  transporter.sendMail(mailOptions);
};

/**Send Meeting Invitation */
const sendInvitation = async (
  senderFirstName,
  senderLastName,
  participants,
  meeting,
  roomName
) => {
  let transporter = nodeMailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const capitalizeSenderFirstName = await capitalizeName(senderFirstName);
  const capitalizeSenderLastName = await capitalizeName(senderLastName);

  for (const participant of participants) {
    let text = "";
    let subject = "";
    const capitalizeParticipantFirstName = await capitalizeName(
      participant.firstName
    );
    const capitalizeParticipantLastName = await capitalizeName(
      participant.lastName
    );
    const formattedStartDate = await formatDate(meeting.start);
    const formattedEndDate = await formatDate(meeting.end);

    if (meeting.end > meeting.start) {
      subject = `Invitation ${meeting.title}`;
      text =
        `Bonjour ${capitalizeParticipantFirstName} ${capitalizeParticipantLastName},` +
        "\n\n" +
        `${capitalizeSenderFirstName} ${capitalizeSenderLastName} vous invite à ${meeting.title} qui va se dérouler dans la période allant de ${formattedStartDate} à ${formattedEndDate} de ${meeting.startTime} H à ${meeting.endTime} H à ${roomName}.`;
    } else {
      subject = `Invitation ${meeting.title}`;
      text =
        `Bonjour ${capitalizeParticipantFirstName} ${capitalizeParticipantLastName},` +
        "\n" +
        `${capitalizeSenderFirstName} ${capitalizeSenderLastName} vous invite à ${meeting.title} qui va se dérouler ${formattedStartDate} de ${meeting.startTime} H
         à ${meeting.endTime} H à ${roomName}.`;
    }

    let mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: participant.email,
      subject: subject,
      text: text,
    };
    transporter.sendMail(mailOptions);
  }
};

/**Send Canceled Meeting Notification */
const SendCanceledMeeting = async (
  senderFirstName,
  senderLastName,
  participants,
  meeting
) => {
  let transporter = nodeMailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const capitalizeSenderFirstName = await capitalizeName(senderFirstName);
  const capitalizeSenderLastName = await capitalizeName(senderLastName);

  for (const participant of participants) {
    let text = "";
    let subject = "";
    const capitalizeParticipantFirstName = await capitalizeName(
      participant.firstName
    );
    const capitalizeParticipantLastName = await capitalizeName(
      participant.lastName
    );
    const formattedStartDate = await formatDate(meeting.start);
    const formattedEndDate = await formatDate(meeting.end);

    if (meeting.end > meeting.start) {
      subject = `Annulation ${meeting.title}`;
      text =
        `Bonjour ${capitalizeParticipantFirstName} ${capitalizeParticipantLastName},` +
        "\n\n" +
        `La formation ${meeting.title} organisé par ${capitalizeSenderFirstName} ${capitalizeSenderLastName} prévu de ${formattedStartDate} à ${formattedEndDate} est annulé.`;
    } else {
      subject = `Annulation ${meeting.title}`;
      text =
        `Bonjour ${capitalizeParticipantFirstName} ${capitalizeParticipantLastName},` +
        "\n\n" +
        `La réunion ${meeting.title} organisé par ${capitalizeSenderFirstName} ${capitalizeSenderLastName} prévu ${formattedStartDate} de ${formattedEndDate} à ${meeting.endTime} est annulé.`;
    }

    let mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: participant.email,
      subject: subject,
      text: text,
    };
    transporter.sendMail(mailOptions);
  }
};

const formatDate = async (dateStr) => {
  const currentDate = new Date();
  const inputDate = new Date(dateStr);

  const options = { year: "numeric", month: "long", day: "numeric" };

  if (currentDate.toDateString() === inputDate.toDateString()) {
    return "Aujourd'hui";
  } else {
    return inputDate.toLocaleDateString("fr-FR", options);
  }
};

const capitalizeName = async (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

module.exports = {
  sendUserAuth,
  sendInvitation,
  SendCanceledMeeting,
  sendUserNewPassword,
  capitalizeName
};
