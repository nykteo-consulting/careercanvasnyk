# careercanvasnyk

Thème Hugo du site [nykteo.com](https://nykteo.com) : fork de [CareerCanvas](https://github.com/felipecordero/careercanvas) de Felipe Cordero (licence MIT, voir `LICENSE`).

Dépôt public : n'y mettre aucune donnée personnelle ni confidentielle. Le contenu et la configuration du site sont dans le dépôt privé `nykteo-web`.

## Principales différences avec CareerCanvas

- Aucune ressource chargée depuis un CDN : Font Awesome, GSAP, Devicon et les polices sont servis par le site (chemins configurables).
- Polices par variables CSS (`--font-body`, `--font-heading`, `--font-brand`) au lieu de Google Fonts.
- Logos clair/sombre, favicons, `theme-color`, thème par défaut configurables.
- Hero : bio en Markdown, effet typewriter optionnel et accessible.
- Section « à propos » : colonnes de même hauteur, encadré de réalisations clés en deux groupes, plus de fenêtre modale.
- Pages de contenu (`single`, liste du blog) : bandeau de titre, colonne de lecture, typographie dédiée.
- `lang` de la page, libellés et `aria-label` traduits via `i18n`.
- Point d'accroche `layouts/partials/head-end.html` (côté site) chargé après la feuille du thème.

## Paramètres ajoutés (`[params]`)

| Paramètre | Rôle | Défaut |
|---|---|---|
| `logo`, `logo_dark` | logo de l'en-tête (fond clair / sombre) | texte `home_text` |
| `favicon_svg`, `apple_touch_icon`, `theme_color` | icônes et couleur du navigateur | aucun |
| `default_theme` | `light` ou `dark` à la première visite | `dark` |
| `hero_typewriter` | `false` pour un sous-titre fixe ; phrases séparées par « . » | `true` |
| `fontawesome_css` | feuille Font Awesome | `/vendor/fontawesome/css/all.min.css` |
| `devicon_css`, `devicon_base` | feuille Devicon (optionnelle), dossier des icônes SVG | `""`, `/vendor/devicon/` |
| `gsap_url`, `fslightbox_url` | scripts GSAP et fslightbox (galeries) | `/vendor/gsap/gsap.min.js`, `/vendor/fslightbox/index.js` |
| `color_palettes` | palette (couleurs principale, secondaire, tertiaire) | voir `COLOR_CUSTOMIZATION.md` |

Paramètres de page ajoutés : `kicker` (surtitre du bandeau), `show_meta: false` (masque date et temps de lecture d'un article).
Données des sections « à propos » : `intro`, `passion_title`, `passion_text`, `achievements_title`, `achievement_groups` (`title`, `icon`, `items` avec `highlight` et `text`), `quickfacts` (`icon`, `title`, `value` en Markdown).

## Installation

Le site l'inclut en sous-module dans `themes/careercanvas`. Tailwind est compilé par le pipeline `postCSS` de Hugo à partir de la configuration du site (`tailwind.config.js`, `postcss.config.js`).

## Licence

MIT : voir [LICENSE](LICENSE).
