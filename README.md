# Zephyr

*Your Personal Environmental Health Guardian*

Zephyr is an intelligent environmental health monitoring application that uses real-time satellite data to provide personalized health advice based on your exact location. Unlike traditional weather apps that only show numbers, Zephyr interprets environmental data to help you understand how conditions might affect your health and wellbeing.

![photo-collage png](https://github.com/user-attachments/assets/72b8202b-1ae1-4706-93f8-184b10c91242)


## Features

### Core Health Monitoring
- **Temperature Analysis**: Personalized alerts for extreme heat/cold with health recommendations
- **UV Index Tracking**: Real-time UV exposure warnings with sunscreen reminders
- **Air Quality Assessment**: PM2.5, PM10, ozone, and pollutant monitoring with health impact explanations
- **Pollen Forecasting**: Comprehensive pollen tracking for 6 different allergen types (Alder, Birch, Grass, Mugwort, Olive, Ragweed)
- **Barometric Pressure**: Pressure change alerts for migraine and joint pain sufferers
- **Health Risk Scoring**: Visual risk assessment combining multiple environmental factors

### Intelligent Interpretation
- **Compound Effect Analysis**: Understands how multiple environmental factors interact (e.g., high UV + heat)
- **Personalized Recommendations**: Tailored advice based on WHO and EPA health guidelines
- **Scientific Accuracy**: All assessments backed by established health research and medical guidelines
- **Location-Specific Data**: Precise environmental data for your exact coordinates, not just city-wide averages

### User Experience
- **Interactive Map Visualization**: See environmental conditions overlaid on your location
- **Time-Based Forecasting**: Check conditions for different hours of the day
- **Detailed Breakdowns**: Access raw data with clear explanations when needed
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Why Zephyr?

### Unlike Competitors
- **AirCare**: Provides pure data without health interpretation
- **IQAir's AirVisual**: Limited to air quality statistics only
- **Weather Apps**: Show conditions but don't explain health impacts

### Zephyr's Advantage
- Translates complex environmental data into actionable health advice
- Combines multiple environmental factors for comprehensive risk assessment
- Provides specific recommendations, not just warnings
- Explains the "why" behind environmental health impacts

## Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS + DaisyUI**: Modern, responsive styling
- **React Leaflet**: Interactive mapping
- **React Icons**: Comprehensive icon library

### Data Sources
- **Zephyr API**: Real-time satellite environmental data
- Comprehensive metrics including UV, temperature, air quality, pollen, and atmospheric pressure

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bababubudev/taikai_hackathon.git
cd taikai_hackathon/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── details/           # Dashboard page
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── details/          # Dashboard-specific components
│   │   ├── ui/           # UI components
│   │   ├── DashboardView.tsx
│   │   ├── MapView.tsx
│   │   ├── PollenOverview.tsx
│   │   └── StatsOverview.tsx
│   ├── Header.tsx
│   ├── Main.tsx
│   └── MapComponent.tsx
├── lib/                   # Utility libraries
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # General utilities
│   └── pollenUtils.ts    # Pollen-specific calculations
├── providers/            # React context providers
│   └── WeatherDataContext.tsx
└── services/             # API services
    └── data.ts
```

## Key Components

### Health Risk Assessment
The app calculates comprehensive health risk scores by analyzing:
- Temperature extremes and deviations from seasonal norms
- UV radiation levels using WHO guidelines
- Air quality (PM2.5, PM10, NO2, O3, SO2) based on EPA standards
- Barometric pressure changes that may trigger health symptoms
- Compound effects of multiple environmental factors

### Pollen Analysis
Advanced pollen monitoring includes:
- Real-time concentration levels for 6 allergen types
- Severity classification based on established medical thresholds
- Overall pollen index calculation (0-10 scale)
- Personalized recommendations for allergy sufferers

### Environmental Data Integration
- Real-time satellite data processing
- Intelligent caching for optimal performance
- Multiple forecast hours available
- Precise geolocation-based measurements

## API Integration

The app integrates with the Zephyr environmental data API:

```typescript
// Example API endpoint
/api/v1/data?lng=23.8452736&lat=61.4531072&forecastHour=1
```

Supported metrics:
- UV Index (`uv`)
- Temperature (`tm`)
- Surface Pressure (`sp`)
- Air Quality (PM2.5, PM10, NO2, O3, CO, SO2)
- Pollen Concentrations (6 types)

## Health Guidelines & Scientific Backing

All health assessments are based on established guidelines from:
- World Health Organization (WHO)
- Environmental Protection Agency (EPA)
- Medical research on environmental health impacts
- Established thresholds for sensitive populations

## Future Roadmap

### Planned Features
- **Community Reporting**: Crowd-sourced health symptom mapping
- **Exposure Logging**: Monthly environmental exposure tracking
- **Smart Home Integration**: IoT device connectivity for air purifiers, etc.
- **Personalized Health Profiles**: Custom alerts for specific conditions (asthma, allergies)
- **Advanced Analytics**: Long-term health trend analysis

### Environmental Factors Under Consideration
- Seasonal Affective Disorder (SAD) indicators
- Lunar cycle correlations
- Daylight duration impacts
- Atmospheric electrical charge
- Green space accessibility
- Noise pollution levels
- Light pollution effects

## Accessibility & Inclusivity

- Color-blind friendly design with DaisyUI color system
- Screen reader compatible with semantic HTML
- Responsive design for all device types
- Clear, jargon-free health explanations

## Contributing

We welcome contributions. For support, bug reports, or feature requests:
- Open an issue on GitHub

---

*Zephyr - Making environmental health data accessible and actionable for everyone.*
