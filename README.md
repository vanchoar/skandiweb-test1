# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json', './tsconfig.app.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

```
scandiweb-test1
├─ .eslintrc.cjs
├─ README.md
├─ backend
│  ├─ controllers
│  │  └─ GraphQL.php
│  ├─ db
│  │  └─ db.php
│  ├─ models
│  │  ├─ Attribute.php
│  │  ├─ AttributeValue.php
│  │  ├─ Categories.php
│  │  ├─ Gallery.php
│  │  ├─ Price.php
│  │  ├─ Product.php
│  │  ├─ ProductAttribute.php
│  │  └─ ProductCategery.php
│  └─ public
│     └─ index.php
├─ data.json
├─ frontend
│  ├─ .eslintrc.cjs
│  ├─ README.md
│  ├─ data.json
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ vite.svg
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ Config
│  │  ├─ Database
│  │  ├─ Pages
│  │  │  ├─ Category.tsx
│  │  │  ├─ Pdp.tsx
│  │  │  └─ components
│  │  │     ├─ CartExpand.tsx
│  │  │     ├─ ContentList.tsx
│  │  │     ├─ Header.tsx
│  │  │     └─ ProductGallery.tsx
│  │  ├─ Router
│  │  ├─ Schema
│  │  ├─ assets
│  │  │  ├─ ProductGallery.css
│  │  │  ├─ cart.png
│  │  │  ├─ cart_btn.png
│  │  │  ├─ cart_items
│  │  │  │  └─ cart_item1.png
│  │  │  ├─ galleryImage.png
│  │  │  ├─ index.css
│  │  │  ├─ item.png
│  │  │  ├─ item1.png
│  │  │  ├─ logo.png
│  │  │  ├─ logo1.png
│  │  │  └─ react.svg
│  │  ├─ main.tsx
│  │  ├─ public
│  │  └─ vite-env.d.ts
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ vite.svg
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ Config
│  ├─ Controller
│  ├─ Model
│  │  ├─ Attribute.php
│  │  ├─ AttributeValue.php
│  │  ├─ Categories.php
│  │  ├─ Gallery.php
│  │  ├─ Price.php
│  │  ├─ Product.php
│  │  ├─ ProductAttribute.php
│  │  └─ ProductCategery.php
│  ├─ Pages
│  │  ├─ Category.tsx
│  │  ├─ Pdp.tsx
│  │  └─ components
│  │     ├─ CartExpand.tsx
│  │     ├─ ContentList.tsx
│  │     ├─ Header.tsx
│  │     └─ ProductGallery.tsx
│  ├─ Router
│  ├─ Schema
│  ├─ assets
│  │  ├─ ProductGallery.css
│  │  ├─ cart.png
│  │  ├─ cart_btn.png
│  │  ├─ cart_items
│  │  │  └─ cart_item1.png
│  │  ├─ galleryImage.png
│  │  ├─ index.css
│  │  ├─ item.png
│  │  ├─ item1.png
│  │  ├─ logo.png
│  │  ├─ logo1.png
│  │  └─ react.svg
│  ├─ main.tsx
│  └─ public
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```