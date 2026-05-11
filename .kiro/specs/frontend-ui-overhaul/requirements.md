# Requirements Document

## Introduction

This document specifies the requirements for a comprehensive frontend UI overhaul of the Brillit.io educational video platform. The project is a React 19 + Tailwind CSS v4 + Vite single-page application. The current design is dark-mode only with a violet accent colour. The overhaul introduces a global light/dark theme system, fixes all horizontal overflow issues, redesigns the Navbar, Sidebar, Profile page, and Video player page, and adds meaningful contextual loading and error states throughout the application. All existing logic, routing, context providers, and API calls remain unchanged — only UI and styling are modified.

## Glossary

- **ThemeContext**: A React context that stores and distributes the current colour theme (`dark` | `light`) and a toggle function to all components.
- **Theme_Toggle**: The Sun/Moon icon button rendered inside the Navbar that switches between dark and light themes.
- **Navbar**: The fixed 64 px-tall top navigation bar present on all authenticated pages.
- **Sidebar**: The collapsible left navigation rail on desktop and the bottom tab bar on mobile.
- **Mini_Sidebar**: The collapsed desktop sidebar state showing icons only at 64 px width.
- **Full_Sidebar**: The expanded desktop sidebar state showing icon + label at 200 px width.
- **UpdateProfile**: The `/update-profile` route component that allows users to edit their name, password, and avatar.
- **Videoplay**: The `/videos/:id` route component that renders the YouTube player and related videos.
- **Skeleton**: A shimmer placeholder element displayed while async data is loading.
- **Loading_Context**: The existing `LoadingContext` that tracks global loading state (`LLoading`).
- **Frosted_Glass**: A semi-transparent surface with `backdrop-filter: blur()` applied.
- **Violet_Accent**: The brand colour `#7c3aed` / `#a78bfa` used for interactive elements, borders, and highlights in both themes.

---

## Requirements

### Requirement 1: Global Theme System

**User Story:** As a user, I want to switch between dark and light modes, so that I can use the platform comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE ThemeContext SHALL expose a `theme` value (`"dark"` | `"light"`) and a `toggleTheme` function to all descendant components.
2. WHEN the application first loads, THE ThemeContext SHALL read the stored theme from `localStorage` key `"brillit-theme"` and initialise `theme` to that value, defaulting to `"dark"` if no value is stored.
3. WHEN `toggleTheme` is called, THE ThemeContext SHALL switch `theme` to the opposite value and persist the new value to `localStorage` key `"brillit-theme"`.
4. WHILE `theme` is `"dark"`, THE application root element SHALL apply a background colour of `#0a0a0f` and text colour of `#f1f1f3`.
5. WHILE `theme` is `"light"`, THE application root element SHALL apply a background colour of `#f8fafc` and text colour of `#0f172a`.
6. THE Violet_Accent colour SHALL remain `#7c3aed` / `#a78bfa` in both `"dark"` and `"light"` themes.
7. WHEN `theme` changes, THE application SHALL transition background and text colours within 200 ms using a CSS transition.
8. THE ThemeContext provider SHALL wrap the entire application in `main.jsx` so that all routes receive theme state.

---

### Requirement 2: Responsive Layout — No Horizontal Overflow

**User Story:** As a user on any device, I want every page to fit within the viewport width, so that I never encounter a horizontal scrollbar.

#### Acceptance Criteria

1. THE application root container SHALL set `overflow-x: hidden` and `max-width: 100vw` to prevent horizontal overflow on all pages.
2. WHEN the viewport width is 320 px, EVERY page SHALL render all content within the viewport without triggering a horizontal scrollbar.
3. WHEN the viewport width is 375 px, EVERY page SHALL render all content within the viewport without triggering a horizontal scrollbar.
4. WHEN the viewport width is 768 px, EVERY page SHALL render all content within the viewport without triggering a horizontal scrollbar.
5. WHEN the viewport width is 1024 px, EVERY page SHALL render all content within the viewport without triggering a horizontal scrollbar.
6. WHEN the viewport width is 1280 px, EVERY page SHALL render all content within the viewport without triggering a horizontal scrollbar.
7. WHEN the viewport width is 1536 px or wider, EVERY page SHALL render all content within the viewport without triggering a horizontal scrollbar.
8. THE Navbar, Sidebar, Videoplay, UpdateProfile, Login, SignUp, and home feed pages SHALL each use `w-full`, `max-w-*`, or `overflow-hidden` on their outermost containers to constrain width.
9. IF a child element would exceed the container width, THEN THE container SHALL clip or wrap the child element rather than expanding beyond the viewport.

---

### Requirement 3: Navbar Redesign

**User Story:** As a user, I want a polished, functional navigation bar, so that I can search, toggle the theme, and access my account from any page.

#### Acceptance Criteria

1. THE Navbar SHALL be fixed at the top of the viewport with a height of exactly 64 px and a `z-index` that keeps it above all page content.
2. THE Navbar SHALL render a Frosted_Glass background using `backdrop-filter: blur(16px)` and a semi-transparent base colour that adapts to the current theme.
3. THE Navbar SHALL display a bottom border with a subtle violet glow (`box-shadow: 0 1px 0 rgba(139,92,246,0.3)`) in both themes.
4. THE Navbar left section SHALL display the Sparkles icon followed by the text "Brillit.io" as a gradient logo link that navigates to `/`.
5. WHEN the viewport width is 640 px or wider, THE Navbar center section SHALL display a full-width search input with a search icon and a "Search" button.
6. WHEN the viewport width is less than 640 px, THE Navbar center section SHALL display only a search icon button that expands to a full-width input overlay when tapped.
7. THE Navbar right section SHALL display the Theme_Toggle button followed by a user avatar/initials dropdown button.
8. WHEN the user avatar/initials button is clicked, THE Navbar SHALL display a dropdown menu containing the user's full name, email, and a "Logout" option.
9. WHEN the "Logout" option is selected, THE Navbar SHALL call the existing logout API and redirect to `/login`.
10. THE Theme_Toggle button SHALL display a Sun icon WHILE `theme` is `"dark"` and a Moon icon WHILE `theme` is `"light"`.
11. WHEN the Theme_Toggle button is clicked, THE Navbar SHALL call `toggleTheme` from ThemeContext.
12. THE Navbar SHALL render on all authenticated pages: home feed (`/`), `/synthai`, `/videos/:id`, and `/update-profile`.

---

### Requirement 4: Sidebar Redesign with Toggle

**User Story:** As a user on desktop, I want a collapsible sidebar, so that I can navigate quickly while maximising screen space.

#### Acceptance Criteria

1. WHILE the viewport width is 640 px or wider, THE Sidebar SHALL render as a vertical left rail fixed below the Navbar.
2. THE Sidebar SHALL have two states: Mini_Sidebar (64 px wide, icons only) and Full_Sidebar (200 px wide, icon + label).
3. WHEN the application first loads on desktop, THE Sidebar SHALL default to the Mini_Sidebar state.
4. THE Sidebar SHALL display a toggle button (chevron or arrow icon) that switches between Mini_Sidebar and Full_Sidebar states.
5. WHEN the toggle button is clicked, THE Sidebar SHALL animate the width transition between 64 px and 200 px within 250 ms using a CSS transition.
6. WHILE a nav item's route matches the current `location.pathname`, THE Sidebar SHALL highlight that item with a violet left border (3 px, `#7c3aed`) and a violet-tinted background (`rgba(139,92,246,0.1)`).
7. WHILE the Sidebar is in Full_Sidebar state, THE Sidebar SHALL display the icon and the text label for each nav item side by side.
8. WHILE the Sidebar is in Mini_Sidebar state, THE Sidebar SHALL display only the icon for each nav item, centred horizontally.
9. WHILE the viewport width is less than 640 px, THE Sidebar SHALL render as a bottom tab bar with `backdrop-filter: blur(16px)` and a height of 64 px.
10. THE bottom tab bar SHALL display the same nav items (Home, SynthAI, You) as the desktop sidebar.
11. THE Sidebar background and border colours SHALL adapt to the current theme.
12. WHEN the main content area is rendered, THE main content SHALL offset its left margin by the current Sidebar width (64 px or 200 px) on desktop to prevent content overlap.

---

### Requirement 5: Profile Page Redesign (UpdateProfile)

**User Story:** As a user, I want a well-designed settings page, so that I can view my profile information and update my details in a clear, organised layout.

#### Acceptance Criteria

1. THE UpdateProfile page SHALL render the Navbar at the top of the page.
2. THE UpdateProfile page SHALL use a two-column layout on viewports 768 px and wider: a left profile card column and a right edit form column.
3. WHEN the viewport width is less than 768 px, THE UpdateProfile page SHALL stack the profile card above the edit form in a single column.
4. THE left profile card SHALL display the user's avatar (photo or initials) surrounded by a violet ring (`ring-2 ring-violet-500`).
5. THE left profile card SHALL display the user's full name, email address, and account join date below the avatar.
6. THE left profile card SHALL display a "Videos Watched" stat showing the count from the user's watch history.
7. THE right edit form SHALL contain fields for first name, last name, current password, new password, and photo upload, matching the existing `handleSubmit` logic.
8. WHILE the profile update API call is in progress, THE UpdateProfile page SHALL display the message "Updating your profile..." inside the submit button.
9. IF the profile update API call returns a 401 error, THEN THE UpdateProfile page SHALL display the message "Session expired. Please log in again."
10. IF the profile update API call returns any other error, THEN THE UpdateProfile page SHALL display the specific error message from the API response, falling back to "Failed to update profile."
11. THE UpdateProfile page background and card colours SHALL adapt to the current theme.

---

### Requirement 6: Video Player Page Redesign (Videoplay)

**User Story:** As a user watching a video, I want a clean, well-structured player layout, so that I can focus on the content and easily browse related videos.

#### Acceptance Criteria

1. WHEN the viewport width is less than 1024 px, THE Videoplay page SHALL render the player at full width with related videos stacked below it.
2. WHEN the viewport width is 1024 px or wider, THE Videoplay page SHALL render the player occupying approximately two-thirds of the content width with a related videos column on the right.
3. THE player container SHALL maintain a 16:9 aspect ratio at all viewport widths.
4. BELOW the player, THE Videoplay page SHALL display the video title in a prominent font size (at least `text-lg`), the channel name in a muted colour, and a collapsible description section.
5. THE related videos list SHALL display each video as a card with a thumbnail (144 px wide), title (2-line clamp), channel name, and duration badge.
6. WHILE the watch history API call is in progress, THE Videoplay page SHALL display Skeleton placeholders for the related videos list instead of the Loader dots component.
7. THE Skeleton placeholders SHALL match the dimensions of the related video cards (thumbnail + text lines).
8. IF the watch history API call fails, THEN THE Videoplay page SHALL display the message "Could not load related videos. Try refreshing the page."
9. THE Videoplay page background and card colours SHALL adapt to the current theme.
10. THE related videos section SHALL display a "Related videos" heading above the list.

---

### Requirement 7: Meaningful Loading and Error States

**User Story:** As a user, I want informative feedback during loading and error conditions, so that I always know what the application is doing.

#### Acceptance Criteria

1. WHEN a video search is in progress, THE application SHALL display the message "Searching for [query]..." where `[query]` is the current search term.
2. WHEN the home feed tab videos are loading, THE application SHALL display the message "Loading your feed...".
3. WHEN the profile update is in progress, THE UpdateProfile page SHALL display the message "Updating your profile..." (covered by Requirement 5.8).
4. IF a search API call returns a network error (no response from server), THEN THE application SHALL display the message "Network error — check your connection and try again."
5. IF a search API call returns a 401 response, THEN THE application SHALL display the message "Your session has expired. Please log in again." with a link to `/login`.
6. IF a search API call returns a 404 response, THEN THE application SHALL display the message "No results found for that query."
7. IF a search API call returns a 500 response, THEN THE application SHALL display the message "Server error — please try again in a moment."
8. WHEN a search returns zero results, THE application SHALL display an empty state with the message "No videos found for '[query]'" and suggest three alternative search terms from the `recommended` list.
9. WHEN the home feed has no videos loaded yet (initial state before any tab is selected), THE application SHALL display the message "Loading your feed..." with the Skeleton grid.
10. THE loading messages SHALL be displayed in the same location as the content they replace (inline, not as a toast notification).

---

### Requirement 8: Theme Toggle Button

**User Story:** As a user, I want a visible theme toggle button in the navbar, so that I can switch between dark and light modes at any time.

#### Acceptance Criteria

1. THE Theme_Toggle button SHALL be rendered in the Navbar right section, to the left of the user avatar button.
2. WHILE `theme` is `"dark"`, THE Theme_Toggle button SHALL display a Sun icon (`lucide-react` `Sun` component, size 18).
3. WHILE `theme` is `"light"`, THE Theme_Toggle button SHALL display a Moon icon (`lucide-react` `Moon` component, size 18).
4. WHEN the Theme_Toggle button is clicked, THE Theme_Toggle button SHALL call `toggleTheme` from ThemeContext and the icon SHALL switch within the same render cycle.
5. THE Theme_Toggle button SHALL apply a smooth icon swap using a CSS opacity or scale transition of 150 ms duration.
6. THE Theme_Toggle button SHALL have an `aria-label` of `"Switch to light mode"` WHILE `theme` is `"dark"` and `"Switch to dark mode"` WHILE `theme` is `"light"`.
7. THE Theme_Toggle button SHALL be keyboard-focusable and activatable via the Enter and Space keys.
8. WHEN the theme changes, ALL components that consume ThemeContext SHALL re-render with the updated colour values within the same animation frame.
