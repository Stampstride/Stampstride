# Stamp Stride Website

Production-ready static website for Stamp Stride mobile notary service.

## Form setup — required before publishing

The quote form uses Formspree to deliver submissions to:

**inquiries@stampstride.com**

1. Create a Formspree account at https://formspree.io/
2. Create a new form and set its notification/recipient email to `inquiries@stampstride.com`.
3. Formspree will give you a form endpoint similar to:
   `https://formspree.io/f/xxxxxxxx`
4. Open `index.html`.
5. Find:
   `https://formspree.io/f/YOUR_FORMSPREE_FORM_ID`
6. Replace only `YOUR_FORMSPREE_FORM_ID` with your actual Formspree form ID.
7. In Formspree, configure the allowed/authorized site domain as `stampstride.com` once the domain is connected.
8. Push the files to GitHub and publish with GitHub Pages.

## Files

- `index.html` — main website
- `styles.css` — responsive styling
- `script.js` — navigation, date validation, form handling
- `thank-you.html` — post-submission confirmation
- `assets/logo.png` — replace with the Stamp Stride logo if needed

## Important

The form cannot securely send email directly from GitHub Pages without a form-processing service. The Formspree endpoint is the server-side portion that receives the POST and sends the notification email.

Do not put an SMTP password, email account password, API secret, or other private credential into the HTML/JavaScript.
