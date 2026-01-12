import sgMail from "@sendgrid/mail";

let initialized = false;

export function initSendGrid() {
    if (!initialized) {
        sgMail.setApiKey(process.env.SENDGRID_API!);
        initialized = true;
    }
    return sgMail;
}
