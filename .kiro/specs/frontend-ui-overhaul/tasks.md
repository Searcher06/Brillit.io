# Implementation Plan: Frontend UI Overhaul

## Overview

Incrementally introduce the global theme system, fix layout issues, then redesign each component in dependency order. Each task builds on the previous so there is no orphaned code. All existing business logic, routing, context providers, and API calls are preserved — only UI and styling change.

## Tasks

- [x] 1. Create ThemeContext and SidebarContext
  - [x] 1.1 Create `client/src/Context/ThemeContext.jsx`
    - Export `ThemeProvider` component with `useState` lazy initialiser reading `localStorage.getItem("brillit-theme") ?? "dark"`
    - `useEffect` to set `document.documentElement.setAttribute("data-theme", theme)` on every theme change
    - `toggleTheme` persists new value to `localStorage` and flips state; wrap both `getItem` and `setItem` in try/catch to handle blocked storage
    - Export `useTheme` hook that throws a descriptive error when called outside the provider
    - _Requirements: 1.1, 1.2, 1.3, 1.8_

  - [ ]* 1.2 Write property test for ThemeContext — Property 1 (round trip)
    - **Property 1: Theme toggle is a round trip**
    - Install `fast-check` as a dev dependency (`npm install --save-dev fast-check` in `client/`)
    - Use `renderHook` + `act` to call `toggleTheme()` twice and assert `theme` and `localStorage` return to the initial value
    - Tag: `// Feature: frontend-ui-overhaul, Property 1: theme toggle is a round trip`
    - Run minimum 100 iterations
    - _Requirements: 1.3_

  - [ ]* 1.3 Write property test for ThemeContext — Property 2 (localStorage initialisation)
    - **Property 2: localStorage initialisation**
    - For each of `"dark"` and `"light"` stored in localStorage, assert `useTheme().theme` equals the stored value on mount
    - Tag: `// Feature: frontend-ui-overhaul, Property 2: localStorage initialisation`
    - Run minimum 100 iterations
    - _Requirements: 1.2_

  - [ ]* 1.4 Write property test for ThemeContext — Property 7 (consumers re-render on toggle)
    - **Property 7: ThemeContext consumers re-render on toggle**
    - After calling `toggleTheme()`, assert the returned `theme` value differs from the value before the call and is one of `["dark", "light"]`
    - Tag: `// Feature: frontend-ui-overhaul, Property 7: ThemeContext consumers re-render on toggle`
    - Run minimum 100 iterations
    - _Requirements: 8.8_

  - [x] 1.5 Create `client/src/Context/SidebarContext.jsx`
    - Export `SidebarProvider` with `useState(false)` for `sidebarExpanded` and a `toggleSidebar` function
    - Export `useSidebar` hook that throws a descriptive error when called outside the provider
    - _Requirements: 4.2, 4.3, 4.12_

- [x] 2. Update CSS custom properties in `client/src/index.css`
  - [x] 2.1 Add all CSS custom property tokens to `:root` (dark defaults) and `[data-theme="light"]` override block
    - Define all 15 tokens from the design token table: `--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--text-primary`, `--text-muted`, `--text-faint`, `--border-color`, `--border-subtle`, `--glass-bg`, `--glass-bg-heavy`, `--input-bg`, `--input-border`, `--violet-accent`, `--violet-light`, `--violet-glow`
    - Add `html, body { background-color: var(--bg-primary); color: var(--text-primary); transition: background-color 200ms ease, color 200ms ease; }`
    - Add `html, body { overflow-x: hidden; max-width: 100vw; }` to fix root-level horizontal overflow
    - _Requirements: 1.4, 1.5, 1.6, 1.7, 2.1_

  - [x] 2.2 Update existing utility classes to use CSS custom properties
    - Update `.glass` to use `background: var(--glass-bg)` and `border-color: var(--border-subtle)`
    - Update `.input-dark` to use `background: var(--input-bg)` and `border-color: var(--input-border)` and `color: var(--text-primary)`
    - Update `.video-card` to use `background: var(--bg-secondary)` and `border-color: var(--border-color)`
    - Update `.chip` to use `background: var(--bg-tertiary)` and `color: var(--text-muted)`
    - Update `.skeleton` shimmer to use `var(--bg-secondary)` and `var(--bg-tertiary)` for the gradient stops
    - _Requirements: 1.4, 1.5, 2.8_

- [x] 3. Update `client/src/main.jsx` to wrap with ThemeProvider and SidebarProvider
  - Import `ThemeProvider` from `./Context/ThemeContext.jsx` and `SidebarProvider` from `./Context/SidebarContext.jsx`
  - Wrap the existing `<BrowserRouter>` with `<ThemeProvider>` as the outermost wrapper
  - Wrap the existing `<AuthProvider>` (or the innermost appropriate level) with `<SidebarProvider>` so all routes can consume sidebar state
  - Update the hardcoded `backgroundColor: "#0a0a0f"` in the 404 route to use `style={{ backgroundColor: "var(--bg-primary)" }}`
  - _Requirements: 1.8, 4.12_

- [x] 4. Redesign Navbar (`client/src/Components/Navbar.jsx`)
  - [x] 4.1 Add theme toggle and user dropdown to Navbar
    - Import `useTheme` from ThemeContext; add `Sun`, `Moon`, `ChevronDown` from `lucide-react`
    - Add `useState` for `dropdownOpen`; render avatar/initials button that toggles it
    - Dropdown card shows `user.firstName + " " + user.lastName`, `user.email`, and a Logout button calling existing `handleLogOut`
    - Close dropdown on outside click via `useEffect` listening to `mousedown` on `document`
    - Theme_Toggle button: Sun icon when `theme === "dark"`, Moon icon when `theme === "light"`; `aria-label` switches accordingly; 150 ms opacity/scale transition on icon
    - _Requirements: 3.7, 3.8, 3.9, 3.10, 3.11, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [x] 4.2 Apply Frosted_Glass layout and violet glow border to Navbar
    - Set `position: fixed`, `height: 64px`, `z-index: 50`, `backdrop-filter: blur(16px)`
    - Background: `var(--glass-bg)`; bottom border: `box-shadow: 0 1px 0 var(--violet-glow)`
    - Left section: Sparkles icon + "Brillit.io" gradient text link to `/`
    - Center section (sm+): existing search input + Search button using `var(--input-bg)`, `var(--input-border)`, `var(--text-primary)`
    - Replace any remaining hardcoded colour values with CSS custom properties
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 2.8_

  - [x] 4.3 Add mobile search overlay to Navbar
    - Add `useState` for `searchOpen`
    - On `< 640px`: hide center search, show a search icon button that sets `searchOpen = true`
    - When `searchOpen`: render an absolute full-width overlay (z-60) with the search input and a close button; trap focus while open
    - _Requirements: 3.6_

- [ ] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Redesign Sidebar (`client/src/Components/Sidebar.jsx`)
  - [x] 6.1 Implement mini/full toggle with smooth width transition
    - Import `useSidebar` from SidebarContext; consume `sidebarExpanded` and `toggleSidebar`
    - Apply `width: sidebarExpanded ? "200px" : "64px"` via inline style; add `transition: width 250ms cubic-bezier(0.4, 0, 0.2, 1)` and `overflow: hidden` via className
    - Render a toggle button at the bottom of the rail using `ChevronRight` / `ChevronLeft` from `lucide-react` that calls `toggleSidebar`
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

  - [x] 6.2 Add active item highlighting and label visibility
    - For each nav item, check `location.pathname` match; apply `border-left: 3px solid #7c3aed` and `background: rgba(139,92,246,0.1)` when active
    - When `sidebarExpanded`: render icon + text label side by side; when mini: render icon only, centred
    - Replace all hardcoded colours with CSS custom properties (`var(--bg-secondary)`, `var(--text-primary)`, `var(--border-subtle)`, etc.)
    - _Requirements: 4.6, 4.7, 4.8, 4.11_

  - [x] 6.3 Update mobile bottom bar to use CSS custom properties
    - Keep existing bottom bar structure and nav items unchanged
    - Replace hardcoded `rgba` background and border values with `var(--glass-bg-heavy)` and `var(--border-subtle)`
    - Ensure `backdrop-filter: blur(16px)` is applied
    - _Requirements: 4.9, 4.10, 4.11_

  - [ ]* 6.4 Write property test for Sidebar — Property 3 (width matches content margin)
    - **Property 3: Sidebar width matches content margin**
    - Render a test `AppLayout` component that consumes `useSidebar` and applies `marginLeft` to a `data-testid="main-content"` div
    - For both `sidebarExpanded = false` (64 px) and `true` (200 px), assert `main.style.marginLeft` equals the expected value
    - Tag: `// Feature: frontend-ui-overhaul, Property 3: sidebar width matches content margin`
    - Run minimum 100 iterations
    - _Requirements: 4.12_

- [x] 7. Update `App.jsx` with contextual loading messages and error states
  - [x] 7.1 Add contextual loading message below the Loader component
    - When `LLoading` is true and `active === "search"`: render `Searching for "${search}"...` in `var(--text-muted)`
    - When `LLoading` is true and `active !== "search"`: render `"Loading your feed..."` in `var(--text-muted)`
    - Wrap the loading block in a `flex flex-col items-center py-24 gap-3` container
    - _Requirements: 7.1, 7.2_

  - [x] 7.2 Implement `getSearchErrorMessage` helper and status-code error display
    - Write a pure `getSearchErrorMessage(error)` function: no response → network error message; 401 → session expired message with `/login` link; 404 → no results message; 5xx → server error message; fallback to `error.response.data?.message`
    - Replace the existing generic error display with the output of this helper
    - _Requirements: 7.4, 7.5, 7.6, 7.7_

  - [x] 7.3 Implement empty state with alternative search suggestions
    - When `currentVideos?.length === 0` and not loading: render `"No videos found for '[query]'"` and 3 chip suggestions from `recommended.slice(0, 3)`
    - Each chip is clickable and triggers a new search for that term
    - _Requirements: 7.8_

  - [ ]* 7.4 Write property test for App.jsx — Property 4 (search loading message contains query)
    - **Property 4: Search loading message contains the query**
    - Extract `getSearchLoadingMessage(query)` as a pure function; test that for any non-empty string the result equals `` `Searching for "${query}"...` ``
    - Tag: `// Feature: frontend-ui-overhaul, Property 4: search loading message contains the query`
    - Run minimum 100 iterations
    - _Requirements: 7.1_

  - [ ]* 7.5 Write property test for App.jsx — Property 5 (empty state suggestions from recommended list)
    - **Property 5: Empty state suggestions are from the recommended list**
    - Extract `getEmptyStateSuggestions(recommended, query)` as a pure function; for any `recommended` array of length ≥ 3, assert result has length 3 and every item is contained in `recommended`
    - Tag: `// Feature: frontend-ui-overhaul, Property 5: empty state suggestions are from recommended list`
    - Run minimum 100 iterations
    - _Requirements: 7.8_

- [x] 8. Redesign UpdateProfile (`client/src/Components/UpdateProfile.jsx`)
  - [x] 8.1 Add Navbar and implement two-column layout
    - Import and render `<Navbar />` at the top of the page (currently missing)
    - Wrap content in `grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto` below the Navbar
    - Add `overflow-x: hidden` and `w-full` to the page root container
    - _Requirements: 5.1, 5.2, 5.3, 2.8_

  - [x] 8.2 Build left profile card with avatar, stats, and theme-aware colours
    - Display avatar: `user.profilePic` as `<img>` or initials `user.firstName[0] + user.lastName[0]` in a violet-ringed circle (`ring-2 ring-violet-500`)
    - Display full name, email, join date (format `user.createdAt` with `luxon` — already installed), and "Videos Watched" count from `user.watchHistory?.length ?? 0`
    - Use `var(--bg-secondary)`, `var(--text-primary)`, `var(--text-muted)`, `var(--border-color)` for all card colours
    - _Requirements: 5.4, 5.5, 5.6, 5.11_

  - [x] 8.3 Update right edit form with improved error messages and loading text
    - Write `getErrorMessage(error)` helper: 401 → `"Session expired. Please log in again."`; otherwise `error?.response?.data?.message ?? "Failed to update profile"`
    - Replace existing error display with `getErrorMessage(error)` output
    - Change submit button loading text from current value to `"Updating your profile..."`
    - Replace all hardcoded colour values in the form with CSS custom properties
    - _Requirements: 5.7, 5.8, 5.9, 5.10, 5.11_

  - [ ]* 8.4 Write property test for UpdateProfile — Property 6 (error message reflects API response)
    - **Property 6: Error message reflects API response**
    - Extract `getProfileErrorMessage(error)` as a pure function; for any error object with `response.data.message`, assert the returned string equals `response.data.message`; for errors without a message field, assert fallback is `"Failed to update profile"`
    - Tag: `// Feature: frontend-ui-overhaul, Property 6: error message reflects API response`
    - Run minimum 100 iterations
    - _Requirements: 5.10_

- [x] 9. Redesign Videoplay (`client/src/Components/Videoplay.jsx`)
  - [x] 9.1 Implement responsive two-column layout with sidebar margin offset
    - Import `useSidebar`; apply `marginLeft: sidebarExpanded ? "200px" : "64px"` to the `<main>` element on `sm+` breakpoints
    - Outer layout: `flex flex-col lg:flex-row gap-6 p-4 lg:p-6`
    - Left column: `flex-1`; right column: `lg:w-80 xl:w-96`
    - Add `overflow-x: hidden` and `w-full` to the page root
    - _Requirements: 6.1, 6.2, 4.12, 2.8_

  - [x] 9.2 Fix player container to maintain 16:9 aspect ratio
    - Wrap `<ReactPlayer>` in `<div style={{ aspectRatio: "16/9" }} className="w-full rounded-xl overflow-hidden bg-black">`
    - Pass `width="100%"` and `height="100%"` to `<ReactPlayer>`
    - _Requirements: 6.3_

  - [x] 9.3 Add video info section with collapsible description
    - Below the player: render video title (`text-lg font-semibold`, `var(--text-primary)`), channel name (`text-sm`, `var(--text-muted)`)
    - Add `useState(false)` for `descExpanded`; show first 3 lines with a "Show more" / "Show less" toggle button
    - Add "Related videos" heading above the related videos list
    - _Requirements: 6.4, 6.10_

  - [x] 9.4 Replace Loader with Skeleton placeholders and add error state
    - While `loading === true`: render 8 skeleton cards matching the design spec (thumbnail `w-36 h-20 rounded-lg` + 3 text line skeletons)
    - If API call fails: render `"Could not load related videos. Try refreshing the page."` in `var(--text-muted)`
    - Replace all hardcoded colours with CSS custom properties
    - _Requirements: 6.5, 6.6, 6.7, 6.8, 6.9_

- [x] 10. Fix responsive layout on remaining pages
  - [x] 10.1 Update Login and SignUp to use CSS custom properties
    - In `client/src/Components/Login.jsx` and `client/src/Components/signup.jsx`: replace all hardcoded `#0a0a0f`, `rgba(255,255,255,...)`, and similar colour values with the appropriate CSS custom properties (`var(--bg-primary)`, `var(--bg-secondary)`, `var(--text-primary)`, `var(--input-bg)`, `var(--input-border)`, etc.)
    - Ensure the outermost container has `w-full overflow-x-hidden`
    - _Requirements: 2.8, 1.4, 1.5_

  - [x] 10.2 Update InfoBox (PersonalizationPage) to use CSS custom properties
    - In `client/src/Components/InfoBox.jsx`: replace hardcoded colour values with CSS custom properties
    - Ensure the outermost container has `w-full overflow-x-hidden`
    - _Requirements: 2.8, 1.4, 1.5_

  - [x] 10.3 Verify overflow-x is contained on all pages
    - Confirm `html, body` have `overflow-x: hidden; max-width: 100vw` (set in task 2.1)
    - Add `overflow-x: hidden` and `w-full` to the outermost container of App.jsx, Videoplay.jsx, and UpdateProfile.jsx if not already present from earlier tasks
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.9_

- [x] 11. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests use `fast-check` (install once in task 1.2); all 7 design properties are covered across tasks 1.2, 1.3, 1.4, 6.4, 7.4, 7.5, and 8.4
- Unit tests and property tests are complementary — property tests cover universal invariants, unit tests cover specific examples and edge cases
- All existing business logic, routing, context providers, and API calls are preserved throughout
