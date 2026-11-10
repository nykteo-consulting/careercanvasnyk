# careercanvasnyk

Thème Hugo du site [nykteo.com](https://nykteo.com). Licence MIT : voir `LICENSE`.

Dépôt public : n'y mettre aucune donnée personnelle ni confidentielle. Le contenu et la configuration du site sont dans le dépôt privé `nykteo-web`.

## Particularités

- Aucune ressource chargée depuis un CDN : Font Awesome, Devicon et les polices sont servis par le site (chemins configurables).
- Aucun script ni style inline : compatible avec une CSP `script-src 'self'; style-src 'self'`. Deux scripts : `assets/js/init.js` (dans `<head>`, thème et animations avant le premier affichage) et `assets/js/main.js` (fin de page).
- Animations en CSS (formes du hero, apparition des sections, machine à écrire). Bouton d'arrêt dans la barre de navigation et lien en pied de page : `<html data-motion="on|off">`, choix mémorisé, `prefers-reduced-motion` respecté par défaut.
- Menus (langue, sous-menus, menu mobile) en `<details>` : utilisables sans JavaScript.
- Formulaire de contact natif (`action` = Formspree) ; avec JavaScript, envoi dans la page et message de statut.
- Polices par variables CSS (`--font-body`, `--font-heading`, `--font-brand`) au lieu de Google Fonts.
- Logos clair/sombre, favicons, `theme-color`, thème par défaut configurables.
- Hero : bio en Markdown, effet machine à écrire optionnel et accessible.
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
| `devicon_css`, `devicon_base` | feuille Devicon (optionnelle), dossier des icônes SVG sous `static/` (résolues à la compilation, repli Font Awesome) | `""`, `/vendor/devicon/` |
| `fslightbox_url` | script fslightbox (galeries) | `/vendor/fslightbox/index.js` |
| `color_palettes` | première palette (`main_color`, `second_color`, `third_color`) : variables CSS générées par `assets/css/colors.css` | gris, rouge, vert |
| `home_title` | `<title>`, `og:title` et `twitter:title` de la page d'accueil (par langue) | « titre du site \| tagline » |
| `og_image`, `og_image_alt` | image de partage 1200 × 630 et son texte alternatif (par langue) | aucun |
| `og_locale` | `og:locale` au format `fr_FR`, `en_GB` (par langue) ; les traductions sont déclarées en `og:locale:alternate` | code de langue |

Paramètres de page ajoutés : `kicker` (surtitre du bandeau), `show_meta: false` (masque date et temps de lecture d'un article), `og_image` et `og_image_alt` (image de partage propre à la page), `robots` (par exemple `"noindex, follow"`, produit une balise `<meta name="robots">`).

Les pages de la section `blog` sont déclarées `og:type = article`, avec `article:published_time`, `article:modified_time`, `article:author` et un `article:tag` par étiquette.
Données des sections « à propos » : `intro`, `passion_title`, `passion_text`, `achievements_title`, `achievement_groups` (`title`, `icon`, `items` avec `highlight` et `text`), `quickfacts` (`icon`, `title`, `value` en Markdown).

## Installation

Le site l'inclut en sous-module dans `themes/careercanvas`. Tailwind est compilé par le pipeline `postCSS` de Hugo à partir de la configuration du site (`tailwind.config.js`, `postcss.config.js`).

## Licence

MIT : voir [LICENSE](LICENSE)
