# Dynamic Event Calendar

A modern, interactive event calendar built with React.js and Tailwind CSS. This application allows users to manage events with an intuitive interface while providing powerful features for event organization.

## 🌟 Features

### Core Functionality
- **Calendar View**
  - Monthly calendar grid with proper day alignment
  - Easy navigation between months
  - Visual differentiation for weekends and current day
  - Responsive design for all screen sizes

### Event Management
- **Create Events**
  - Add events to any date
  - Set event title, description, and time
  - Color coding for different event types
  - Prevent scheduling conflicts with overlap detection

- **Event Viewing**
  - See all events for a selected day
  - Quick preview of events in calendar cells
  - Search functionality to find specific events

- **Event Modifications**
  - Edit existing events
  - Delete unwanted events
  - Color-code events for better organization

### Data Handling
- Local storage persistence for events
- Export monthly events to JSON format
- Search and filter capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14.0.0 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/event-calendar.git
cd event-calendar
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Install required dependencies
```bash
npm install date-fns
# or
yarn add date-fns
```

### Development Server

Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.



## 🎯 Usage

1. **Viewing the Calendar**
   - Navigate between months using arrow buttons
   - Current day is highlighted automatically
   - Events are displayed as color-coded blocks

2. **Adding Events**
   - Click on any date to open the event creation modal
   - Fill in event details (title, time, description)
   - Select a color for the event
   - Click "Add Event" to save

3. **Managing Events**
   - Click on a date to view its events
   - Use the search bar to find specific events
   - Delete events from the event list
   - Export monthly events using the export button

## 🌐 Deployed Application

Visit the live application: [Event Calendar App](https://event-calendar-application-iota.vercel.app/)

## 🛠️ Technologies Used

- React.js
- Tailwind CSS
- date-fns
- LocalStorage API

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Contact

Your Name - [your-email@example.com](mailto:your-email@example.com)

Project Link: [https://github.com/your-username/event-calendar](https://github.com/your-username/event-calendar)
