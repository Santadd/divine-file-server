export function downloadFileTemplate(
    userEmail: string,
  ) {
    const html = `
  <p>Dear ${userEmail},</p>
  <p>Attached to this email is the requested file.</p>
  <p>If you have not requested for this file simply ignore the message.</p>
  <br>

  <p>Sincerely,</p>
  <p>The Lizzy Tech Solutions</p>
  <p><small>Note: replies to this email address are not monitored.</small></p>`;
  
    // return object with html as key
    return {
      html: html,
    };
  }
  