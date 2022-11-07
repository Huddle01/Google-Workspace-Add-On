const onGmailMessageOpen = (e) => {
  const messageId = e.gmail.messageId;

  // Get an access token scoped to the current message and use it for GmailApp
  // calls.
  const accessToken = e.gmail.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  // Get the subject of the email.
  const message = GmailApp.getMessageById(messageId);
  let subject = message.getThread().getFirstMessageSubject();

  // Remove labels and prefixes.
  subject = subject
    .replace(/^([rR][eE]|[fF][wW][dD])\:\s*/, "")
    .replace(/^\[.*?\]\s*/, "");

  // If neccessary, truncate the subject to fit in the image.
  subject = truncate(subject);

  return createAddMeetingCard(subject);
};

const onGmailCompose = () => {
  return createCard("onGmailCompose");
};
