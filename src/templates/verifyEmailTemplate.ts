export function verifyEmailTemplate(
  userEmail: string,
  verificationUrl: string
) {
  const html = `<p>Dear ${userEmail},</p>
  <p>Welcome to <b>Lizzy Tech Solutions</b>!</p>
  <p>To confirm your account please 
      <a href="${verificationUrl}">click here</a>.
  </p>
  <p>Alternatively, you can paste the following link in your browser's address bar:</p>
  <p>${verificationUrl}</p>
  <p>Sincerely,</p>
  <p>The Lizzy Tech Solutions</p>
  <p><small>Note: replies to this email address are not monitored.</small></p>`;

  // return object with html as key
  return {
    html: html,
  };
}
