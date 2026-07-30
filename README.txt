YK Property and Maintenance - ykmaintenance.com

FILES
  index.html      Home: hero carousel, overview, FAQ, how it works, contact form
  services.html   Services
  projects.html   Recent work: five photo carousels with caption bubbles
  404.html        Shown for a mistyped address
  style.css       All styling
  script.js       Menu, scroll reveals, carousels, enquiry form
  favicon.ico     Browser tab icon
  robots.txt      Tells search engines the site is open and where the sitemap is
  sitemap.xml     Lists the three pages for search engines
  images/         Project photos, favicon, link-preview image

DEPLOY THE WHOLE FOLDER, not the individual files. The images folder must
travel with the HTML or the photos will not appear.

CONTACT DETAILS: 07513 349559 / youssufmo@hotmail.com
Coventry and surrounding areas. These appear in index.html and in the footer
of every page.

THE ENQUIRY FORM
Right now, pressing "Send Enquiry" opens the customer's own email app with
their answers filled in, addressed to you. It works today, but the customer
has to press send in their mail app, and some people will drop off there.

To get enquiries delivered straight to your inbox instead (about 2 minutes):
  1. Go to web3forms.com and enter youssufmo@hotmail.com
  2. They email you an access key
  3. Open script.js, find the line   const ACCESS_KEY = '';
     and paste the key between the quotes
  4. Re-deploy
The form will then send in the background and show a thank-you message.

REVIEWS
There is a ready-made reviews section in index.html, commented out. Delete the
comment markers around it and paste in REAL customer quotes to switch it on.

Do not invent reviews. Writing or commissioning fake reviews has been illegal
in the UK since 6 April 2025 under the DMCC Act 2024. Fines reach the higher
of GBP 300,000 or 10% of turnover for a business, and up to GBP 150,000 for
the individual who arranged them.

Best way to collect real ones: create a free Google Business Profile, then
text past customers your review link. Those reviews also help you appear in
local map searches, which testimonials on your own site do not.

CAROUSELS
- Any element with data-carousel becomes a carousel automatically.
- Photos show in full and are never cropped, portrait or landscape.
- The hero carousel rotates every 4.5 seconds and pauses on hover. Change
  data-autoplay="4500" in index.html, or delete it to stop the rotation.
- Photos load as they are needed, and the next one is fetched in advance so
  it is ready before it slides in.

STILL WORTH DOING
- Collect real reviews and switch that section on.
- Set up a free Google Business Profile for Coventry.
- Confirm the opening hours line in index.html is correct
  (currently Monday to Saturday, 8:00 AM - 6:00 PM).
- Check the photo captions on projects.html say what actually happened.
- Add a finished photo of the first bathroom if you have one.
