# financial-app

A mobile app built with [Expo](https://expo.dev) and [Expo Router](https://docs.expo.dev/router/introduction/) for tracking personal finances and subscriptions. Styled with [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native).

## Tech Stack

| Area                | Technology                                                                   |
| ------------------- | ---------------------------------------------------------------------------- |
| Framework           | [Expo](https://expo.dev) `~54.0.36` (New Architecture enabled)               |
| Runtime             | React `19.1.0`, React Native `0.81.5`                                        |
| Routing             | Expo Router `~6.0.24` (file-based, typed routes)                             |
| Navigation          | React Navigation (bottom tabs + native stack, via Expo Router)               |
| Styling             | NativeWind `^4.2.7` + Tailwind CSS `^3.4.19`                                 |
| Language            | TypeScript `~5.9.2` (strict mode)                                            |
| Animations/Gestures | react-native-reanimated, react-native-gesture-handler, react-native-worklets |
| Linting             | ESLint `^9.25.0` with `eslint-config-expo` (flat config)                     |
| Date formatting     | [dayjs](https://day.js.org/) (used in `lib/utlis.ts`)                        |

## Prerequisites

- Node.js and npm
- Expo Go app (for testing on a physical device) or an iOS/Android simulator

## Getting Started

```bash
npm install
npm run start      # opens Expo Dev Tools / Metro bundler
npm run ios        # run on iOS simulator
npm run android     # run on Android emulator
npm run web         # run in the browser
npm run lint         # run ESLint via `expo lint`
```

There is no test script configured in `package.json`.

## Project Structure

```
financial-app/
├── app/                        # Expo Router file-based routes
│   ├── _layout.tsx             # Root layout — wraps the app in a Stack navigator, imports global.css
│   ├── onboarding.tsx          # /onboarding route
│   ├── (auth)/                 # Route group for authentication (segment name hidden from the URL)
│   │   ├── _layout.tsx         # Stack layout for the auth flow (headers hidden)
│   │   ├── sign-in.tsx         # /sign-in
│   │   └── sign-up.tsx         # /sign-up
│   ├── (tabs)/                 # Route group for the main bottom-tab experience
│   │   ├── _layout.tsx         # Tabs layout — builds the tab bar from constants/data.ts + constants/theme.ts
│   │   ├── index.tsx           # / (Home tab)
│   │   ├── subscriptions.tsx   # /subscriptions (Subscriptions tab)
│   │   ├── insights.tsx        # /insights (Insights tab)
│   │   └── settings.tsx        # /settings (Settings tab)
│   └── subscriptions/
│       └── [id].tsx            # /subscriptions/[id] — dynamic route for a single subscription's detail view
│
├── assets/
│   ├── fonts/                  # Plus Jakarta Sans font family (Regular, Light, Medium, SemiBold, Bold, ExtraBold)
│   ├── icons/                  # PNG icons: tab bar icons + brand/service icons (spotify, netflix, notion, github, etc.)
│   ├── images/                 # App icons, splash screens, avatar, logos, tab icon variants (@2x/@3x)
│   └── expo.icon/               # Expo icon source assets (SVG/JSON/PNG)
│
├── constants/
│   ├── data.ts                 # Static config for the tab bar (name/title/icon per tab)
│   ├── icons.ts                # Central import/export map for all icon assets (`icons.home`, `icons.wallet`, ...)
│   ├── images.ts                # Central import/export map for image assets
│   └── theme.ts                # Design tokens: colors, spacing scale, and derived component sizes (e.g. tab bar height/radius)
│
├── lib/
│   └── utlis.ts                 # Formatting helpers: formatCurrency, formatSubscriptionDateTime (dayjs), formatStatusLabel
│
├── global.css                   # Tailwind directives + `@layer components` utility classes (tabs, home, subscription cards, auth forms, modals, pickers, category chips)
├── type.d.ts                     # Global ambient TypeScript interfaces (AppTab, Subscription, SubscriptionCardProps, UpcomingSubscription, etc.)
├── image.d.ts                    # Module declarations so .png/.jpg/.jpeg/.svg/.gif imports type-check
├── expo-env.d.ts                 # Auto-generated Expo/TypeScript environment types (do not edit manually)
├── nativewind-env.d.ts           # NativeWind's TypeScript environment types
│
├── app.json                      # Expo app config (name, icon, splash, platform settings, plugins, experiments)
├── babel.config.js               # Babel preset: babel-preset-expo + NativeWind's JSX transform
├── metro.config.js               # Metro bundler config, wrapped with NativeWind (points at global.css)
├── tailwind.config.js            # Tailwind theme: content paths, color palette, spacing scale, font families
├── tsconfig.json                 # Extends expo/tsconfig.base; strict mode; `@/*` path alias to project root
├── eslint.config.js              # Flat ESLint config extending eslint-config-expo
├── package.json                  # Scripts and dependencies
├── .vscode/                      # Editor settings (recommends the Expo VS Code extension; format/organize-imports on save)
└── .expo/                        # Local, machine-specific Expo dev-server cache (git-ignored)
```

## Routing (Expo Router)

Routing is entirely file-based under `app/`:

- **`app/_layout.tsx`** is the root layout. It imports `global.css` (registering Tailwind/NativeWind globally) and renders a `Stack` with headers hidden.
- **Route groups** — folders wrapped in parentheses, e.g. `(auth)` and `(tabs)` — organize routes without adding a URL segment. Each group has its own `_layout.tsx`:
    - `(auth)/_layout.tsx` renders a header-less `Stack` for `sign-in` and `sign-up`.
    - `(tabs)/_layout.tsx` renders a `Tabs` navigator. Tab bar items are generated by mapping over `tabs` from `constants/data.ts`; the bar's visual styling (height, radius, insets, icon frame) comes from `constants/theme.ts`, and `useSafeAreaInsets` keeps it clear of the device's home indicator.
- **Dynamic routes** — `app/subscriptions/[id].tsx` reads the `id` param via `useLocalSearchParams` and resolves any `/subscriptions/<id>` URL.
- **Typed routes** are enabled (`experiments.typedRoutes` in `app.json`), with generated types under `.expo/types/router.d.ts`.

Current route map:

| Path                  | File                           | Notes                                                                          |
| --------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `/`                   | `app/(tabs)/index.tsx`         | Home tab; currently placeholder content with nav links to other routes         |
| `/subscriptions`      | `app/(tabs)/subscriptions.tsx` | Subscriptions tab (placeholder)                                                |
| `/insights`           | `app/(tabs)/insights.tsx`      | Insights tab (placeholder)                                                     |
| `/settings`           | `app/(tabs)/settings.tsx`      | Settings tab (placeholder)                                                     |
| `/subscriptions/[id]` | `app/subscriptions/[id].tsx`   | Subscription detail (placeholder)                                              |
| `/onboarding`         | `app/onboarding.tsx`           | Onboarding screen (placeholder, contains inline notes on Expo Router concepts) |
| `/(auth)/sign-in`     | `app/(auth)/sign-in.tsx`       | Sign-in screen (placeholder)                                                   |
| `/(auth)/sign-up`     | `app/(auth)/sign-up.tsx`       | Sign-up screen (placeholder)                                                   |

> Most screens currently render placeholder text (`<Text>Insights</Text>`, etc.) rather than finished UI — the navigation shell is in place ahead of the feature implementation.

## Styling

Styling uses **NativeWind**, which lets Tailwind utility classes be used directly on React Native components via `className`.

- `tailwind.config.js` scans `app/**` and `components/**` for class usage, and extends Tailwind's theme with the app's color palette (`background`, `foreground`, `card`, `muted`, `primary`, `accent`, `border`, `success`, `destructive`, `subscription`), a custom pixel-based spacing scale, and font-family tokens (`sans`, `sans-light`, `sans-medium`, `sans-semibold`, `sans-bold`, `sans-extrabold`) mapped to the Plus Jakarta Sans font files.
- `global.css` declares the three Tailwind layers and a large set of reusable component classes (`@layer components`) for tab bar icons, home screen balance card, upcoming/subscription list cards, auth form elements, modal sheets, pickers, and category chips.
- `constants/theme.ts` mirrors the Tailwind color/spacing tokens as plain JS objects (`colors`, `spacing`, `components`) for use in places that need raw style values instead of class names (e.g. `tabBarStyle` in `(tabs)/_layout.tsx`, which React Navigation requires as a style object rather than a class).
- `metro.config.js` wires NativeWind into Metro's bundler, pointing it at `global.css` as the Tailwind entry point.
- `babel.config.js` adds the NativeWind Babel preset and sets `jsxImportSource: "nativewind"` so JSX elements pick up NativeWind's styling behavior.

## Configuration Files Reference

| File                      | Purpose                                                                                                                                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app.json`                | Expo app manifest: app name/slug/version, icon & splash screen, iOS/Android/Web platform config, the `expo-router` and `expo-splash-screen` plugins, and experimental flags (`typedRoutes`, `reactCompiler`). |
| `babel.config.js`         | Babel presets: `babel-preset-expo` (with NativeWind's JSX import source) and `nativewind/babel`.                                                                                                              |
| `metro.config.js`         | Extends Expo's default Metro config with NativeWind, using `global.css` as the Tailwind CSS entry point.                                                                                                      |
| `tailwind.config.js`      | Tailwind theme configuration — content paths, extended color palette, spacing scale, font family tokens.                                                                                                      |
| `tsconfig.json`           | Extends `expo/tsconfig.base`; strict type-checking; `@/*` path alias resolving to the project root.                                                                                                           |
| `eslint.config.js`        | Flat ESLint config built on `eslint-config-expo`; ignores `dist/*`.                                                                                                                                           |
| `.vscode/settings.json`   | Enables format-on-save code actions: fix-all, organize imports, sort members.                                                                                                                                 |
| `.vscode/extensions.json` | Recommends the Expo VS Code extension.                                                                                                                                                                        |
| `.gitignore`              | Excludes `node_modules`, `.expo`, native `ios`/`android` build folders, env files, build artifacts, and OS/editor cruft.                                                                                      |

## Type Declarations

- **`type.d.ts`** — global ambient interfaces used across the app without explicit imports: `AppTab`, `TabIconProps`, `Subscription`, `SubscriptionCardProps`, `UpcomingSubscription`, `UpcomingSubscriptionCardProps`, `ListHeadingProps`. These model the subscription-tracking domain (price, currency, billing cycle, renewal date, status, category, payment method, etc.) even though the corresponding UI isn't built out yet.
- **`image.d.ts`** — declares `.png`/`.jpg`/`.jpeg`/`.svg`/`.gif` as importable modules so image imports type-check.
- **`expo-env.d.ts`** — auto-generated by Expo; regenerated on `expo start`/`expo prebuild`, not meant to be hand-edited.
- **`nativewind-env.d.ts`** — NativeWind's ambient types (e.g. `className` prop support on RN components).

## Assets

- **Fonts** (`assets/fonts/`): Plus Jakarta Sans, 6 weights, referenced by the `sans-*` Tailwind font-family tokens.
- **Icons** (`assets/icons/`): tab bar icons (home, wallet, activity, setting, add, back, menu, plus) and third-party service/brand icons (spotify, netflix, notion, github, figma, adobe, canva, dropbox, medium, openai, claude) — all re-exported through `constants/icons.ts`.
- **Images** (`assets/images/`): app icon variants, splash screens, avatar, logos, and tab icon PNGs at `@2x`/`@3x` densities — re-exported through `constants/images.ts`.

## Domain Model (from `type.d.ts`)

The `Subscription` interface anchors the app's core feature — subscription tracking — with fields for plan, category, payment method, status, start date, price/currency, billing cycle, renewal date, and a display color. `UpcomingSubscription` is a lighter-weight shape (name, price, currency, days until renewal) intended for a "coming up" summary list, matching the `upcoming-card` styles already defined in `global.css`.
