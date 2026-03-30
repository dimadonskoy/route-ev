# RouteEV ⚡

**Smart, AI-powered Delivery Route Optimization for Electric Vehicles.**

RouteEV is a modern web application designed to streamline the last-mile delivery workflow for electric vehicles. By combining visual label scanning with advanced route optimization and terrain awareness, it ensures your deliveries are both efficient and energy-smart.

---

## ✨ Key Features

### 🤖 AI-Powered Label Scanning
Extract recipient names and addresses instantly from postal labels using your phone's camera. Powered by **Claude 3.5 Sonnet**, the extraction is highly accurate even with handwriting or complex layouts.

### 🔋 EV-Specific Optimization
Different EVs have different consumption profiles. RouteEV models:
- **Light EVs**: Optimized for agility and short-range efficiency.
- **EV Sedans**: Balanced for range and performance.
- **EV Vans**: Designed for higher payloads and consumption.

### 🏔️ Terrain & Regen Awareness
Traditional routers ignore the impact of gravity. RouteEV uses **OpenRouteService** elevation data to calculate:
- **Energy Drain**: Battery loss on steep climbs.
- **Regen Recovery**: Real-time energy gain from downhills.
- **Elevation Profiling**: Visual charts to help drivers prepare for the route ahead.

### 🗺️ Native Navigation Exports
Seamlessly export your optimized stops to your favorite navigation apps:
- **Google Maps**: Full multi-stop route export.
- **Waze**: Direct navigation to the next stop with a single tap.

---

## 🚀 Quick Start

### 🐳 Run with Docker (Recommended)
The fastest way to get up and running is using the provided Docker configuration.

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd route-ev
    ```

2.  **Start the container**:
    ```bash
    docker compose up -d --build
    ```

3.  **Access the app**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🛠️ Local Development
If you prefer running it directly on your machine:

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the dev server**:
    ```bash
    npm run dev
    ```

---

## 🔑 Configuration

To unlock the full power of RouteEV, you'll need the following API keys (configurable in the **Setup** tab):

- **Anthropic Claude API Key**: Required for AI address extraction. Get one at [console.anthropic.com](https://console.anthropic.com/).
- **OpenRouteService (ORS) API Key**: Required for geocoding, route optimization, and elevation data. Get a free key at [openrouteservice.org](https://openrouteservice.org/).

> [!NOTE]
> Without an ORS key, the app will fallback to a Nearest-Neighbour routing algorithm and simulated elevation profiling.

---

## 💻 Tech Stack

- **Core**: React 19 + Vite 8
- **Styling**: Vanilla CSS (Modern CSS Variables & Flexbox)
- **Typography**: Outfit (via Google Fonts)
- **APIs**: Anthropic Claude & OpenRouteService
- **Containerization**: Docker & Docker Compose

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
# route-ev
