# Lina Fernando Photography: Interactive Web Portfolio

Group project for a fictional client, a Sri Lankan landscape photographer. A multi-page, responsive site built with HTML, CSS and JavaScript only.

## Project structure
```
index.html        Home (hero, services, about)
portfolio.html    Portfolio gallery (loaded from JSON, filter + modal)
contact.html      Contact form with validation
css/layout.css    Responsive layout (Grid, Flexbox, breakpoints)
css/style.css     Theme: colours, typography, animations, dark mode
js/nav.js         Hamburger menu
js/theme.js       Dark mode toggle (saved in localStorage)
js/portfolio.js   Fetches data/portfolio.json, filters, modal popup
js/validation.js  Form validation and error handling
data/portfolio.json  Portfolio items
images/           Add real photos here
```

## How to run
The portfolio page uses `fetch()`, so open the site through a local server, not by double-clicking the file.
- VS Code: install **Live Server**, right-click `index.html`, choose **Open with Live Server**.
- Or in a terminal inside the project folder: `python -m http.server 8000`, then visit http://localhost:8000
- GitHub Pages: push to GitHub, then Settings > Pages > deploy from the `main` branch.

## Requirements checklist
- Semantic HTML: header, nav, main, section, article, footer
- 3 pages, with a contact form
- Responsive (mobile, tablet, desktop) using Grid and Flexbox
- Consistent theme; CSS animation (hero entrance, hover transitions, modal)
- JS: hamburger menu, form validation, dynamic JSON rendering, dark mode, modal popup

## Roles and contributions
| Member | Role | Main files |
|---|---|---|
| (name) | Project Manager | Task board, deadlines, merging |
| (name) | HTML Lead | index.html, portfolio.html, contact.html |
| (name) | CSS Layout Designer | css/layout.css |
| (name) | CSS Styling Designer | css/style.css |
| (name) | JS Functionality Developer | js/nav.js, js/theme.js, js/portfolio.js |
| (name) | JS Validation Developer | js/validation.js |
| (name) | Content Manager | data/portfolio.json, images/, page copy |
| (name) | Testing & Documentation Lead | README.md, browser testing |

## Testing
Checked in Chrome, Firefox and Edge at about 375px, 768px and 1280px widths. Keyboard navigation, Escape closes the modal, and the form shows an error for each invalid field.

## Known limitations
The contact form validates and shows a success message but does not email anyone (no backend). Portfolio images are CSS gradient placeholders until real photos are added.

## Shop features (v2)
- Shop page with photographer names, category filters and a Buy licence button (Personal, Commercial, Extended)
- Demo checkout, then download of the photo and a licence file; no real payments
- "Sell your work" page: any photographer can upload a photo and set a price
- Glass (frosted) interface using `backdrop-filter`, new colour theme, light/dark modes

**Limitation:** seller uploads are stored in each visitor's own browser. A real marketplace needs a backend (for example Firebase or Supabase) and a payment provider such as Stripe.
