# Design Document — Frontend UI Overhaul

## Overview

This document describes the technical design for the Brillit.io frontend UI overhaul. The project is a React 19 + Tailwind CSS v4 + Vite SPA. The overhaul introduces a global light/dark theme system, fixes horizontal overflow, and redesigns the Navbar, Sidebar, UpdateProfile page, and Videoplay page. All existing business logic, routing, context providers, and API calls are preserved — only UI and styling change.

### Key Design Principles

- **CSS custom properties as the single source of truth for colour.** All components read from `--bg-primary`, `--text-primary`, etc. rather than hardcoding `#0a0a0f`. The theme switch is a single attribute change on `<html>`.
- **ThemeContext is the only new context.** It is thin — a string state + toggle function + localStorage sync. No reducer needed.
- **Sidebar toggle state lives in the Sidebar component.** It does not need to be global; only the main content `marginLeft` needs to react, which is passed down as a prop or read from a shared CSS variable.
- **No new dependencies.** All icons come from the already-installed `lucide-react`. No new packages are added.

---

## Architecture

### Component Tree (after overhaul)

```
main.jsx
└── ThemeProvider          ← NEW: wraps everything, sets data-theme on <html>
    └── BrowserRouter
        └── AuthProvider
            └── ... (existing context providers unchanged)
                └── Routes
                    ├── / → App
                    │       ├── Navbar          ← redesigned
                    │       ├── Sidebar         ← redesigned (toggle)
                    │       └── main (dynamic marginLeft)
                    ├── /videos/:id → Videoplay ← redesigned
                    ├── /update-profile → UpdateProfile ← redesigned
                    └── /login, /signUp, ...
```

### Theme Application Flow

```
ThemeProvider
  │  useState("dark" | "light")  ← initialised from localStorage
  │  useEffect → sets document.documentElement.setAttribute("data-theme", theme)
  │  useEffect → persists to localStorage on change
  └─ exposes { theme, toggleTheme } via ThemeContext

index.css
  :root { --bg-primary: #0a0a0f; --text-primary: #f1f1f3; ... }
  [data-theme="light"] { --bg-primary: #f8fafc; --text-primary: #0f172a; ... }

All components
  → use var(--bg-primary) instead of hardcoded #0a0a0f
  → CSS transition: background-color 200ms, color 200ms on body/html
```

---

## Components and Interfaces

### 1. ThemeContext (`client/src/Context/ThemeContext.jsx`)

**New file.**

```jsx
// Interface
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("brillit-theme") ?? "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("brillit-theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

**Rationale:** `useState` with a lazy initialiser is sufficient — no `useReducer` needed for a two-value toggle. The `data-theme` attribute on `<html>` is the CSS hook; no inline styles are injected into components.

**Integration point:** `ThemeProvider` is added as the outermost wrapper in `main.jsx`, outside `BrowserRouter` so that even the router's scroll restoration can read the theme.

---

### 2. CSS Custom Properties (`client/src/index.css`)

All hardcoded colour values in components are replaced with CSS custom properties. The properties are defined on `:root` (dark defaults) and overridden under `[data-theme="light"]`.

| Custom Property     | Dark value                    | Light value                   | Usage                          |
|---------------------|-------------------------------|-------------------------------|--------------------------------|
| `--bg-primary`      | `#0a0a0f`                     | `#f8fafc`                     | Page background                |
| `--bg-secondary`    | `rgba(255,255,255,0.04)`      | `rgba(0,0,0,0.04)`            | Card / glass surfaces          |
| `--bg-tertiary`     | `rgba(255,255,255,0.06)`      | `rgba(0,0,0,0.06)`            | Hover states, chips            |
| `--text-primary`    | `#f1f1f3`                     | `#0f172a`                     | Body text, headings            |
| `--text-muted`      | `#6b7280`                     | `#64748b`                     | Secondary text, placeholders   |
| `--text-faint`      | `#374151`                     | `#94a3b8`                     | Tertiary text, timestamps      |
| `--border-color`    | `rgba(255,255,255,0.08)`      | `rgba(0,0,0,0.1)`             | Card borders, dividers         |
| `--border-subtle`   | `rgba(255,255,255,0.05)`      | `rgba(0,0,0,0.06)`            | Navbar/sidebar borders         |
| `--glass-bg`        | `rgba(10,10,15,0.85)`         | `rgba(248,250,252,0.85)`      | Frosted-glass surfaces         |
| `--glass-bg-heavy`  | `rgba(10,10,15,0.95)`         | `rgba(248,250,252,0.95)`      | Mobile bottom bar              |
| `--input-bg`        | `rgba(255,255,255,0.05)`      | `rgba(0,0,0,0.05)`            | Input fields                   |
| `--input-border`    | `rgba(255,255,255,0.1)`       | `rgba(0,0,0,0.15)`            | Input borders                  |
| `--violet-accent`   | `#7c3aed`                     | `#7c3aed`                     | Brand accent (unchanged)       |
| `--violet-light`    | `#a78bfa`                     | `#7c3aed`                     | Gradient text, active icons    |
| `--violet-glow`     | `rgba(139,92,246,0.3)`        | `rgba(124,58,237,0.2)`        | Navbar bottom border glow      |

The `body` and `html` elements receive:
```css
html, body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 200ms ease, color 200ms ease;
}
```

Existing utility classes (`.glass`, `.input-dark`, `.video-card`, `.chip`, `.skeleton`) are updated to use these custom properties instead of hardcoded rgba values.

---

### 3. Navbar (`client/src/Components/Navbar.jsx`)

**Redesigned.** Existing logic (search trigger, logout, navigation) is preserved.

**New elements:**
- `Theme_Toggle` button (Sun/Moon from `lucide-react`)
- User avatar/initials dropdown (replaces bare LogOut button)
- Mobile search overlay (full-width input that appears when search icon is tapped on `< 640px`)

**State:**
```jsx
const [searchOpen, setSearchOpen] = useState(false); // mobile search overlay
const [dropdownOpen, setDropdownOpen] = useState(false); // user menu
const { theme, toggleTheme } = useTheme();
```

**Layout structure:**
```
<nav> (fixed, h-16, z-50, glass-bg, violet glow border)
  ├── Left: Logo (Sparkles + "Brillit.io" gradient text)
  ├── Center: 
  │     sm+: search input + Search button (full width, max-w-xl)
  │     <sm: hidden (replaced by overlay when searchOpen)
  ├── Right:
  │     Theme_Toggle button (Sun | Moon, aria-label)
  │     Avatar/initials button → dropdown (name, email, Logout)
  │     <sm: search icon button (sets searchOpen=true)
  └── Mobile overlay (absolute, full-width, z-60, when searchOpen)
        input + close button
```

**Theme_Toggle implementation:**
```jsx
<button
  onClick={toggleTheme}
  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
  className="..."
>
  {theme === "dark"
    ? <Sun size={18} style={{ transition: "opacity 150ms, transform 150ms" }} />
    : <Moon size={18} style={{ transition: "opacity 150ms, transform 150ms" }} />
  }
</button>
```

**User dropdown:** Rendered as an absolutely-positioned card below the avatar button. Closed on outside click via a `useEffect` that listens to `mousedown` on `document`. Contains user `firstName + lastName`, `email`, and a Logout button that calls the existing `handleLogOut`.

---

### 4. Sidebar (`client/src/Components/Sidebar.jsx`)

**Redesigned.** Navigation items and routing logic are preserved.

**State:**
```jsx
const [sidebarExpanded, setSidebarExpanded] = useState(false); // false = mini (64px)
```

**Width values:**
- Mini: `64px` (icons only, centred)
- Full: `200px` (icon + label, side by side)

**CSS transition:**
```css
.sidebar-rail {
  width: var(--sidebar-width); /* set inline via style prop */
  transition: width 250ms cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
```

**Toggle button:** A `ChevronRight` / `ChevronLeft` icon button at the bottom of the rail. Clicking it flips `sidebarExpanded`.

**Main content offset:** `App.jsx` and `Videoplay.jsx` receive the sidebar width as a CSS variable or prop. The simplest approach is to set `--sidebar-width` on `:root` via a `useEffect` in Sidebar, and have `main` use `margin-left: var(--sidebar-width)`. This avoids prop drilling.

Alternatively (simpler): Sidebar exports a `SIDEBAR_WIDTH` constant object `{ mini: 64, full: 200 }` and the expanded state is lifted to a shared context `SidebarContext` (a single boolean). `App.jsx` and `Videoplay.jsx` consume it to set `marginLeft`.

**Decision:** Use a minimal `SidebarContext` (new file `client/src/Context/SidebarContext.jsx`) that exposes `{ sidebarExpanded, toggleSidebar }`. This is cleaner than a CSS variable side-effect and avoids prop drilling across routes.

**Mobile bottom bar:** Unchanged in structure; updated to use CSS custom properties for colours.

---

### 5. SidebarContext (`client/src/Context/SidebarContext.jsx`)

**New file.**

```jsx
const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const toggleSidebar = () => setSidebarExpanded(p => !p);
  return (
    <SidebarContext.Provider value={{ sidebarExpanded, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
```

Added to `main.jsx` inside `ThemeProvider`.

---

### 6. UpdateProfile (`client/src/Components/UpdateProfile.jsx`)

**Redesigned.** All form logic, API calls, and state (`data`, `preview`, `loading`) are preserved.

**Layout (md+ two-column grid):**
```
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
  ├── Left card: avatar ring, full name, email, join date, videos watched stat
  └── Right card: edit form (name fields, password fields, photo upload, submit)
```

**Left profile card data sources:**
- Avatar: `user.profilePic` or initials from `user.firstName[0] + user.lastName[0]`
- Full name: `user.firstName + " " + user.lastName`
- Email: `user.email`
- Join date: `user.createdAt` formatted with `luxon` (already installed)
- Videos watched: `user.watchHistory?.length ?? 0`

**Error message logic:**
```jsx
const getErrorMessage = (error) => {
  if (error?.response?.status === 401) return "Session expired. Please log in again.";
  return error?.response?.data?.message || "Failed to update profile";
};
```

**Loading button text:** `"Updating your profile..."` (replaces current `"Saving..."`)

**Navbar:** Added at the top of the page (currently missing from UpdateProfile).

**Theme adaptation:** All hardcoded `#0a0a0f`, `rgba(255,255,255,...)` values replaced with CSS custom properties.

---

### 7. Videoplay (`client/src/Components/Videoplay.jsx`)

**Redesigned.** All data fetching, navigation, and context consumption are preserved.

**Layout:**
```
<main> (sm:ml-[sidebar-width])
  <div class="flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
    ├── Left (flex-1): player (16:9 aspect ratio) + video info + collapsible description
    └── Right (lg:w-80 xl:w-96): "Related videos" heading + related video list
```

**Player container:**
```jsx
<div style={{ aspectRatio: "16/9" }} className="w-full rounded-xl overflow-hidden bg-black">
  <ReactPlayer url={...} width="100%" height="100%" controls />
</div>
```

**Video info below player:**
- Title: `text-lg font-semibold` (at least `text-lg`)
- Channel: `text-sm` in `--text-muted`
- Collapsible description: `useState(descExpanded)`, shows first 3 lines with "Show more" toggle

**Related video skeleton (while `loading === true`):**
```jsx
// 8 skeleton cards, each matching the real card dimensions
<div className="flex gap-3">
  <div className="skeleton w-36 h-20 rounded-lg flex-shrink-0" />
  <div className="flex flex-col gap-2 flex-1">
    <div className="skeleton h-3 w-full rounded" />
    <div className="skeleton h-3 w-2/3 rounded" />
    <div className="skeleton h-3 w-1/3 rounded" />
  </div>
</div>
```

**Error state (API failure):**
```jsx
{error && (
  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
    Could not load related videos. Try refreshing the page.
  </p>
)}
```

**Theme adaptation:** All hardcoded colours replaced with CSS custom properties.

---

### 8. App.jsx (home feed) — Loading and Error State Messages

**Modified.** Logic unchanged; loading/error display text updated.

**Loading message:**
```jsx
{LLoading && (
  <div className="flex flex-col items-center py-24 gap-3">
    <Loader />
    <p style={{ color: "var(--text-muted)" }} className="text-sm">
      {active === "search"
        ? `Searching for "${search}"...`
        : "Loading your feed..."}
    </p>
  </div>
)}
```

**Error messages by status code:**
```jsx
const getSearchErrorMessage = (error) => {
  if (!error.response) return "Network error — check your connection and try again.";
  if (error.response.status === 401) return "Your session has expired. Please log in again.";
  if (error.response.status === 404) return "No results found for that query.";
  if (error.response.status >= 500) return "Server error — please try again in a moment.";
  return error.response.data?.message || "An unexpected error occurred.";
};
```

**Empty state with suggestions:**
```jsx
// When currentVideos?.length === 0
<EmptyState query={...} suggestions={recommended.slice(0, 3)} />
// Displays "No videos found for '[query]'" + 3 chip suggestions
```

---

## Data Models

### ThemeContext value shape

```typescript
interface ThemeContextValue {
  theme: "dark" | "light";
  toggleTheme: () => void;
}
```

### SidebarContext value shape

```typescript
interface SidebarContextValue {
  sidebarExpanded: boolean;   // false = mini (64px), true = full (200px)
  toggleSidebar: () => void;
}
```

### CSS Custom Property tokens (design tokens)

```typescript
// Resolved at runtime by the browser from :root / [data-theme="light"]
type CSSToken =
  | "--bg-primary" | "--bg-secondary" | "--bg-tertiary"
  | "--text-primary" | "--text-muted" | "--text-faint"
  | "--border-color" | "--border-subtle"
  | "--glass-bg" | "--glass-bg-heavy"
  | "--input-bg" | "--input-border"
  | "--violet-accent" | "--violet-light" | "--violet-glow";
```

### User model (existing, relevant fields for UpdateProfile)

```typescript
interface User {
  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string;
  createdAt: string;          // ISO date string
  watchHistory: string[];     // array of video IDs
  suggestedKeywords: string[];
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Theme toggle is a round trip

*For any* initial theme value (`"dark"` or `"light"`), calling `toggleTheme()` twice in sequence SHALL restore the theme to its original value, and `localStorage.getItem("brillit-theme")` SHALL equal the original value after both calls.

**Validates: Requirements 1.3**

---

### Property 2: localStorage initialisation

*For any* value stored in `localStorage` under key `"brillit-theme"` (either `"dark"` or `"light"`), the `ThemeContext` SHALL initialise `theme` to that stored value on mount. When no value is stored, `theme` SHALL default to `"dark"`.

**Validates: Requirements 1.2**

---

### Property 3: Sidebar width matches content margin

*For any* sidebar state (mini or full), the `marginLeft` applied to the main content area on desktop SHALL equal the current sidebar width (64 px when mini, 200 px when full).

**Validates: Requirements 4.12**

---

### Property 4: Search loading message contains the query

*For any* non-empty search query string, while a search is in progress, the loading message displayed SHALL contain that exact query string (i.e., the message is `"Searching for \"[query]\"..."`).

**Validates: Requirements 7.1**

---

### Property 5: Empty state suggestions are from the recommended list

*For any* empty search result and any `recommended` list, the alternative search terms displayed in the empty state SHALL be a subset of the `recommended` list and SHALL contain exactly 3 items.

**Validates: Requirements 7.8**

---

### Property 6: Error message reflects API response

*For any* profile update API error response that includes a `message` field, the error message displayed to the user SHALL equal `response.data.message`. When no `message` field is present, the fallback message SHALL be `"Failed to update profile"`.

**Validates: Requirements 5.10**

---

### Property 7: ThemeContext consumers re-render on toggle

*For any* component that consumes `ThemeContext`, after `toggleTheme()` is called, the component SHALL reflect the new `theme` value in its next render (i.e., no stale theme values are observed after a toggle).

**Validates: Requirements 8.8**

---

## Error Handling

### Theme initialisation errors

- If `localStorage` is unavailable (e.g., private browsing with storage blocked), the `useState` lazy initialiser catches the exception and defaults to `"dark"`. The `toggleTheme` function also wraps `localStorage.setItem` in a try/catch and silently ignores storage failures — the in-memory state still updates correctly.

### Search API errors

Errors are classified by HTTP status and mapped to user-facing messages in `App.jsx`:

| Condition | Message |
|---|---|
| No response (network error) | "Network error — check your connection and try again." |
| 401 | "Your session has expired. Please log in again." + `/login` link |
| 404 | "No results found for that query." |
| 5xx | "Server error — please try again in a moment." |
| Other | `error.response.data.message` or generic fallback |

### Profile update errors

| Condition | Message |
|---|---|
| 401 | "Session expired. Please log in again." |
| Other | `error.response.data.message` or "Failed to update profile" |

### Videoplay watch history errors

The watch history update is non-critical. Failures are caught silently (`console.warn`) and the page continues to render. The related videos list shows an inline error message if the API call fails.

### Sidebar/Theme context missing

Both `useTheme()` and `useSidebar()` throw a descriptive error if called outside their respective providers, aiding development-time debugging.

---

## Testing Strategy

### Unit Tests (example-based)

These cover specific interactions and states:

- **ThemeContext**: Verify initial theme from localStorage, verify `data-theme` attribute is set on `<html>`, verify Sun/Moon icon swap in Navbar, verify `aria-label` values.
- **Navbar**: Verify dropdown renders user name/email/Logout, verify mobile search overlay appears on icon click, verify logout calls API and redirects.
- **Sidebar**: Verify toggle button switches between 64 px and 200 px widths, verify active item highlighting, verify bottom bar renders on mobile.
- **UpdateProfile**: Verify loading button text is "Updating your profile...", verify 401 error message, verify two-column layout at md+ breakpoint.
- **Videoplay**: Verify skeleton cards render during loading, verify error message on API failure, verify 16:9 aspect ratio container.
- **App.jsx**: Verify "Loading your feed..." message, verify status-code-specific error messages.

### Property-Based Tests

Property-based testing is applicable here because the feature includes pure logic (theme toggle, localStorage sync, error message mapping, loading message interpolation) that varies meaningfully with input. The recommended library is **fast-check** (JavaScript/TypeScript PBT library).

Install: `npm install --save-dev fast-check`

Each property test runs a minimum of **100 iterations**.

**Tag format:** `// Feature: frontend-ui-overhaul, Property {N}: {property_text}`

**Property 1 — Theme toggle round trip:**
```js
// Feature: frontend-ui-overhaul, Property 1: theme toggle is a round trip
fc.assert(fc.property(
  fc.constantFrom("dark", "light"),
  (initialTheme) => {
    localStorage.setItem("brillit-theme", initialTheme);
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    act(() => result.current.toggleTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe(initialTheme);
    expect(localStorage.getItem("brillit-theme")).toBe(initialTheme);
  }
), { numRuns: 100 });
```

**Property 2 — localStorage initialisation:**
```js
// Feature: frontend-ui-overhaul, Property 2: localStorage initialisation
fc.assert(fc.property(
  fc.constantFrom("dark", "light"),
  (storedTheme) => {
    localStorage.setItem("brillit-theme", storedTheme);
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    expect(result.current.theme).toBe(storedTheme);
  }
), { numRuns: 100 });
```

**Property 3 — Sidebar width matches content margin:**
```js
// Feature: frontend-ui-overhaul, Property 3: sidebar width matches content margin
fc.assert(fc.property(
  fc.boolean(), // false = mini, true = full
  (expanded) => {
    const { getByTestId } = render(<AppLayout sidebarExpanded={expanded} />);
    const main = getByTestId("main-content");
    const expectedMargin = expanded ? "200px" : "64px";
    expect(main.style.marginLeft).toBe(expectedMargin);
  }
), { numRuns: 100 });
```

**Property 4 — Search loading message contains query:**
```js
// Feature: frontend-ui-overhaul, Property 4: search loading message contains the query
fc.assert(fc.property(
  fc.string({ minLength: 1 }),
  (query) => {
    const message = getSearchLoadingMessage(query);
    expect(message).toContain(query);
    expect(message).toBe(`Searching for "${query}"...`);
  }
), { numRuns: 100 });
```

**Property 5 — Empty state suggestions are from recommended list:**
```js
// Feature: frontend-ui-overhaul, Property 5: empty state suggestions are from recommended list
fc.assert(fc.property(
  fc.array(fc.string({ minLength: 1 }), { minLength: 3 }),
  fc.string(),
  (recommended, query) => {
    const suggestions = getEmptyStateSuggestions(recommended, query);
    expect(suggestions).toHaveLength(3);
    suggestions.forEach(s => expect(recommended).toContain(s));
  }
), { numRuns: 100 });
```

**Property 6 — Error message reflects API response:**
```js
// Feature: frontend-ui-overhaul, Property 6: error message reflects API response
fc.assert(fc.property(
  fc.record({ message: fc.string({ minLength: 1 }) }),
  (responseData) => {
    const error = { response: { status: 422, data: responseData } };
    const message = getProfileErrorMessage(error);
    expect(message).toBe(responseData.message);
  }
), { numRuns: 100 });
```

**Property 7 — ThemeContext consumers re-render on toggle:**
```js
// Feature: frontend-ui-overhaul, Property 7: ThemeContext consumers re-render on toggle
fc.assert(fc.property(
  fc.constantFrom("dark", "light"),
  (initialTheme) => {
    localStorage.setItem("brillit-theme", initialTheme);
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    const before = result.current.theme;
    act(() => result.current.toggleTheme());
    const after = result.current.theme;
    expect(after).not.toBe(before);
    expect(["dark", "light"]).toContain(after);
  }
), { numRuns: 100 });
```

### Visual / Responsive Tests

Horizontal overflow and breakpoint layout are verified manually or with a visual regression tool (e.g., Playwright screenshot tests) at the breakpoints specified in Requirement 2: 320 px, 375 px, 768 px, 1024 px, 1280 px, 1536 px.

### Accessibility

- All interactive elements (Theme_Toggle, Sidebar toggle, avatar dropdown) have `aria-label` attributes.
- Focus management: the mobile search overlay traps focus while open.
- Keyboard navigation: all buttons are reachable via Tab and activatable via Enter/Space.
