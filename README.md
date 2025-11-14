# PhotoSwipe Comment Plugin

A lightweight **PhotoSwipe v5** plugin that displays a text string from `data-pswp-comment` **centered in the top bar or below the main image**.

> This repository contains the ESM plugin (`photoswipe-comment-plugin.esm.js`),  
> a minimal `sample.html` demo, and `package.json` ready for GitHub distribution.

---

## ✨ Features

- Read comment text from `data-pswp-comment` on the trigger element
- Centered label in the PhotoSwipe **top bar** or below the main image
- Auto-hide when empty (`autoHideOnEmpty: true`)
- Zero dependency, safe for repeated init/destroy
- Fully compatible with **PhotoSwipe v5.4.4**

---

## 📂 File Structure

```
.
├── photoswipe-comment-plugin.esm.js
├── sample.html
├── package.json
├── README.md
└── LICENSE
```

---

## 🚀 Sample Demo

1. Open `sample.html` using any static server  
   (e.g. `python3 -m http.server`)
2. Ensure internet access to load PhotoSwipe from the UNPKG CDN.
3. Click a thumbnail to open the lightbox and check the centered comment text.

---

## 💡 Usage (ESM)

```html
<link rel="stylesheet" href="https://unpkg.com/photoswipe@5/dist/photoswipe.css">
<div id="gallery">
  <a href="image1_large.jpg"
     data-pswp-width="1920"
     data-pswp-height="1080"
     data-pswp-comment="Warm and cozy!">
    <img src="image1_small.jpg" alt="">
  </a>
  <!-- ... -->
</div>

<script type="module">
  import PhotoSwipeLightbox from 'https://unpkg.com/photoswipe@5/dist/photoswipe-lightbox.esm.js';
  import PhotoSwipeCommentPlugin from './photoswipe-comment-plugin.esm.js';

  const lightbox = new PhotoSwipeLightbox({
    gallery: '#gallery',
    children: 'a',
    pswpModule: () => import('https://unpkg.com/photoswipe@5/dist/photoswipe.esm.js'),
    loop: true
  });

  // Initialize plugin
  new PhotoSwipeCommentPlugin(lightbox);

  lightbox.init();
</script>
```

---

## ⚙️ Options

| Option | Type | Default | Description |
|---|---|---|---|
| `attr` | string | `'data-pswp-comment'` | Attribute name to read the text from. |
| `getText` | function | `null` | Custom getter `(pswp, index, slide) => string`. If provided, overrides `attr` lookup. |
| `topBarHeight` | number | 60 | Height of the comment bar area in pixels. |
| `textColor` | string | '#ffffff' | Text color of the comment label. |
| `autoHideOnEmpty` | boolean | `true` | Hide the label when text is empty. |
| `maxWidthPct` | number | `70` | Max width of the label as a percentage of the top bar width. |
| `minAspectRatioToShowBelowImage` | number | `1` | Shows the comment below the main image only when the viewport aspect ratio is wider than this value (e.g., values above 1 indicate landscape orientation). If the viewport is narrower than this threshold, the comment will appear in the top bar instead. |
| `classPrefix` | string | `'pswp-comment'` | Class prefix for scoping injected CSS. |

---

## 🧠 Behavior Details

- The text updates on `afterInit` and every slide `change`.
- The CSS is injected into the **current PhotoSwipe instance root** and removed on `destroy`.
- If `getText` is not provided, the plugin fetches text from:
  1. `slide.data.element` or `slide.data.originalElement` → `getAttribute(attr)`  
  2. Fallbacks: `slide.data.comment` → `slide.data.caption` → `''`

---

## 🛠 Development

No build step is required. The plugin is a single **ES module** file.  
If you plan to publish to npm, update the `name`, `version`, and `exports` fields in `package.json`.

---

## 📄 License

MIT  
Copyright (c) 2025
