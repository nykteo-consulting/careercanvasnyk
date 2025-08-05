# CareerCanvas Hugo Theme

A modern, responsive Hugo theme for personal websites and portfolios, created by Felipe Cordero. This theme is designed to showcase your professional experience, skills, and projects in a clean and elegant way, with a focus on engineering and technical portfolios.

## Features

- Responsive design with modern UI
- Dark mode support
- Portfolio showcase with image galleries
- Blog support
- Skills section with interactive cards
- Experience timeline
- Contact form
- Social media integration
- Multilingual support (English/French)
- Resume/CV integration
- Tailwind CSS for styling
- Optimized for technical and engineering portfolios

## Demo

See the theme in action at [felipecordero.com](https://felipecordero.com) - my personal website built with CareerCanvas.

![CareerCanvas Demo](https://raw.githubusercontent.com/felipecordero/felipecordero.github.io/main/static/images/personal_web_demo.png)

## Installation

### As a Git Submodule

```bash
git submodule add https://github.com/felipecordero/careercanvas.git themes/careercanvas
```

### As a Git Clone

```bash
git clone https://github.com/felipecordero/careercanvas.git themes/careercanvas
```

## Configuration

Add the following to your `config.toml`:


```toml
theme = "careercanvas"

[params]
  name = "Your Name"
  tagline = "Your Tagline"
  location = "Your Location"
  email = "your.email@example.com"
  profile_image = "/images/your-profile.jpg"
  description = "Your description"
  author = "Your Name"

  # Social Media
  linkedin_url = "https://linkedin.com/in/yourprofile"
  github_url = "https://github.com/yourusername"

  # Resume/CV
  resume_url_en = "/files/your-resume-en.pdf"  # Path to English resume
  resume_url_fr = "/files/your-resume-fr.pdf"  # Path to French resume (optional)
  resume_label = "Full Resume"

  # Social Icons
  [[params.social]]
    icon = "linkedin-in"
    url = "https://linkedin.com/in/yourprofile"

  [[params.social]]
    icon = "github"
    url = "https://github.com/yourusername"
```

## Menu Configuration

```toml
[[menu.main]]
  name = "About"
  url = "/#about"
  weight = 2

[[menu.main]]
  name = "Skills"
  url = "/#skills"
  weight = 3

[[menu.main]]
  name = "Experience"
  url = "/#experience"
  weight = 4

[[menu.main]]
  name = "Contact"
  url = "/#contact"
  weight = 5
```

## Image Galleries

The theme includes a gallery shortcode for showcasing your work:

```markdown
{{< gallery dir="images/your-gallery" >}}
```

## 🚀 Development

To start the development server:

```bash
npm run dev
```

This command runs `hugo server -D`, which starts a local server and includes draft content (content with `draft: true` in the front matter). This is useful for previewing unpublished or in-progress content during development.

The site will be available at `http://localhost:1313`

## 🏗️ Building

To build the site for production, you need to:

1. Build the CSS with Tailwind:
   ```bash
   npm run build:css
   ```

2. Build the site with Hugo:
   ```bash
   npm run build
   ```

Or you can do both in one command:
```bash
npm run build:css && npm run build
```

The built site will be in the `public/` directory.

Note: The CSS build step is necessary because the site uses Tailwind CSS, which needs to be processed to generate the final CSS file with only the used styles.

## 📁 Project Structure

- `assets/` - Contains source files for CSS, JavaScript, and other assets
- `content/` - Contains the content of your site
- `static/` - Contains static files like images
- `themes/careercanvas/` - Contains the CareerCanvas theme
- `config.toml` - Main configuration file
- `tailwind.config.js` - Tailwind CSS configuration

## 🛠️ Technologies Used

- [Hugo](https://gohugo.io/) - Static site generator
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) - Typography plugin for Tailwind CSS
- [CareerCanvas](https://github.com/felipecordero/careercanvas) - Custom Hugo theme

## 👨‍💻 About the Theme

The CareerCanvas theme is my own creation, designed specifically for technical and engineering portfolios. It features:
- Modern, responsive design
- Dark mode support
- Interactive components
- Image galleries
- Multilingual support
- Optimized for technical content

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/felipecordero/careercanvas/issues).

## 📫 Contact

For any questions or suggestions, please open an issue in the GitHub repository or visit [felipecordero.com](https://felipecordero.com).

## 🚨 Important Note

The built CSS file (`static/css/main.css`) is committed to this repository so that users can use the theme without running npm or Tailwind. If you make changes to the CSS source files, please run `npm run build:css` and commit the updated `main.css` file. 