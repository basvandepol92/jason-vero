# Jason & Vero 12.5 Fest App

This is the official mobile application for the **Jason & Vero 12.5 Year Anniversary Festival**. Built with **Ionic Angular** and backed by **Directus CMS**, this app provides guests with a dynamic schedule, live updates, an interactive map, and essential festival information.

## 📱 Features

-   **Home**: Dynamic countdown to the event and "Happening Now" highlights.
-   **News Feed**: Real-time updates and announcements, with pinned post support.
-   **Schedule**: Complete timeline of events, grouped by day. Status indicators for live events.
-   **Map**: Interactive festival map using Leaflet, with custom markers for stages, food, and facilities.
-   **Info**: Accordion-style information pages (Transport, Rules, FAQ) and emergency contact access.
-   **Notifications**: Push notifications via OneSignal for important alerts.
-   **Offline Support**: PWA capabilities for reliable access during the festival.

## 🛠 Tech Stack

-   **Frontend**: [Ionic Framework 8](https://ionicframework.com/), [Angular 19](https://angular.io/)
-   **State Management**: Angular Signals
-   **Backend / CMS**: [Directus 11](https://directus.io/) (Headless CMS)
-   **Database**: PostgreSQL (via Directus)
-   **Maps**: [Leaflet](https://leafletjs.com/)
-   **Notifications**: [OneSignal](https://onesignal.com/)
-   **Testing**: Jasmine & Karma (Unit Tests)
-   **Linting**: ESLint
-   **CI/CD**: GitHub Actions
-   **Hosting**: Firebase Hosting (Frontend), Railway (Backend)

## 🚀 Getting Started

### Prerequisites

-   Node.js (LTS version recommended)
-   npm
-   Ionic CLI: `npm install -g @ionic/cli`
-   Docker (for running the CMS locally)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### 🗄️ Setting up the CMS (Directus)

The backend is configured to run via Docker. Code is located in the `cms/` directory.

1.  **Navigate to the CMS folder:**
    ```bash
    cd cms
    ```

2.  **Configure Environment:**
    Create a `.env` file in the `cms/` folder based on your secrets (keys, DB credentials).

3.  **Start Directus:**
    ```bash
    docker-compose up -d
    ```
    Access the admin panel at `http://localhost:8055`.

4.  **Seed Data (Optional):**
    Use the setup script to seed initial schema and data.
    ```bash
    node setup-directus.js
    ```

### 🏃‍♂️ Running the App

1.  **Start the development server:**
    ```bash
    ionic serve
    ```
    The app will proceed to localhost:8100.

    > **Note:** Ensure `DISABLE_REDIS="true"` is set in your CMS environment for development to avoid caching issues with live updates.

## 🧪 Testing & Quality

### Unit Tests
Run the comprehensive test suite (Jasmine/Karma):
```bash
npm test
```
*Current Coverage: ~74% (60+ tests passing)*

### Linting
Check for code style issues:
```bash
npm run lint
```

## 📦 Building & Deployment

### Production Build
```bash
npm run build -- --configuration=production
```
The output will be in the `www/` directory.

### CI/CD Pipeline
A GitHub Actions workflow is configured in `.github/workflows/firebase-hosting-merge.yml`.
-   **Triggers**: Push to `main`.
-   **Steps**: Lint -> Test -> Build -> Deploy to Firebase.

### Manual Deployment
1.  **Firebase Hosting** (Frontend):
    ```bash
    firebase deploy
    ```
2.  **Railway** (Backend):
    Connect your GitHub repository to Railway and point it to the `cms/` directory or use the provided Docker deployment guide.

## 📁 Project Structure

-   `src/app/tabs`: Main page components (Home, Feed, Schedule, Map, Info).
-   `src/app/core/services`: Core logic (API, State, Notifications).
-   `src/app/models`: TypeScript interfaces.
-   `cms/`: Directus Docker configuration and setup scripts.
-   `docker-compose.yml`: Local backend orchestration.

---
*Created with ❤️ for Jason & Vero*
