# Smart IELTS Frontend

A modern, responsive web application built with Next.js 15 for IELTS test preparation and practice. This frontend provides a comprehensive platform for students to practice all four IELTS skills: Reading, Writing, Listening, and Speaking.

## 🚀 Features

### Core Functionality
- **IELTS Reading Tests**: Interactive passage reading with multiple-choice questions and navigation controls
- **IELTS Writing Tests**: Essay writing practice with AI-powered evaluation
- **IELTS Listening Tests**: Voice-assisted listening exercises using ElevenLabs AI
- **IELTS Speaking Tests**: Real-time conversation practice with AI evaluation using Gemini API
- **Question Bank**: Comprehensive collection of IELTS practice questions
- **Dashboard**: Personal progress tracking with band scores history
- **Admin Panel**: Administrative controls for managing tests and questions

### Advanced Features
- **AI-Powered Voice Assistants**: Integration with ElevenLabs for natural conversation practice
- **Real-time Evaluation**: Instant feedback using Google's Gemini AI
- **Score Tracking**: Comprehensive band score history with detailed breakdowns
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Modern dark UI with consistent styling
- **Progress Analytics**: Visual charts and progress tracking using Recharts

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15.5.3**: React framework with App Router
- **React 18**: Component-based UI library
- **TypeScript**: Type-safe JavaScript development

### Styling & UI
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Framer Motion**: Animation library for smooth interactions
- **Class Variance Authority**: Component variant management

### AI & Voice Integration
- **ElevenLabs Client**: AI voice conversation integration
- **Google Gemini API**: AI-powered content evaluation

### Data Visualization
- **Recharts**: Interactive charts for progress tracking

### Development Tools
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: CSS vendor prefix automation

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── actions/       # Server actions
│   │   ├── admin/         # Admin panel pages
│   │   ├── dashboard/     # User dashboard
│   │   ├── listening/     # Listening test interface
│   │   ├── login/         # Authentication pages
│   │   ├── question-bank/ # Question management
│   │   ├── reading/       # Reading test interface
│   │   ├── signup/        # User registration
│   │   ├── speaking/      # Speaking test interface
│   │   └── writing/       # Writing test interface
│   ├── components/        # Reusable React components
│   │   ├── ui/           # UI component library
│   │   ├── FloatingChatbot.tsx
│   │   ├── ListeningVoiceAssistant.tsx
│   │   ├── TestSetupPopup.tsx
│   │   └── VoiceAssistant.js
│   ├── lib/              # Utility libraries
│   ├── models/           # TypeScript type definitions
│   │   ├── Evaluation.ts
│   │   ├── MCQ.ts
│   │   ├── Passage.ts
│   │   ├── TestSession.ts
│   │   └── User.ts
│   └── utils/            # Helper functions
├── next.config.mjs       # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Backend API server running (see ../backend/README.md)

### Environment Variables
Create a `.env.local` file in the frontend directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# ElevenLabs AI Configuration
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key
NEXT_PUBLIC_AGENT_ID=your_speaking_agent_id
NEXT_PUBLIC_AGENT_ID_2=your_listening_agent_id

# Authentication (if applicable)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BadhonAhmad/Smart-IELTS.git
   cd Smart-IELTS/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## 🎯 Key Features Detail

### Reading Tests
- Interactive passage reading interface
- Multiple-choice questions with instant feedback
- Navigation between passage and questions
- Progress tracking and score calculation
- Back button for seamless navigation

### Listening Tests
- ElevenLabs AI-powered voice assistant
- One-way audio content delivery
- Interactive MCQ questions
- Real-time answer validation
- Visual feedback with color-coded responses

### Speaking Tests
- Two-way conversation with AI assistant
- Real-time speech evaluation using Gemini AI
- Natural language processing
- Comprehensive feedback system

### Dashboard
- Personal progress overview
- Band scores history modal
- Individual skill breakdowns
- IELTS band level classification
- Visual progress charts

## 🎨 UI/UX Features

- **Dark Theme**: Consistent dark mode throughout the application
- **Responsive Design**: Optimized for all device sizes
- **Smooth Animations**: Framer Motion powered transitions
- **Accessible Components**: WCAG compliant UI elements
- **Modern Icons**: Lucide React icon library
- **Interactive Charts**: Recharts for data visualization

## 🔧 Configuration

### Tailwind CSS
The application uses a custom Tailwind configuration with:
- Custom color palette for dark theme
- Extended spacing and typography scales
- Custom component classes for consistent styling

### TypeScript
Strict TypeScript configuration with:
- Path mapping for clean imports
- Strict type checking enabled
- Custom type definitions for IELTS-specific models

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Configuration
Ensure all environment variables are properly set for production:
- API endpoints
- Authentication secrets  
- Third-party service keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Style

- Follow ESLint configuration
- Use TypeScript for type safety
- Follow Next.js best practices
- Use Tailwind CSS for styling
- Implement responsive design patterns

## 🐛 Known Issues

- Voice assistant may require user interaction to start in some browsers
- Real-time evaluation depends on stable internet connection
- Some features require backend API to be running

## 📄 License

This project is licensed under the MIT License - see the LICENSE file in the root directory for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the backend API documentation

## 🔮 Future Enhancements

- Real-time collaboration features
- Advanced analytics dashboard
- Mobile app development
- Offline mode capabilities
- Multi-language support

---

**Built with ❤️ using Next.js and modern web technologies**