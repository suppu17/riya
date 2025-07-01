# SnapStyler 🛍️✨
 Demo Vide: https://youtu.be/9yQzZdF8qgs
> **Your Personal Conversational Real-time AI Stylist**

SnapStyler is a next-generation fashion shopping application that revolutionizes online shopping through AI-powered conversational experiences. Built with cutting-edge technologies including Tavus AI and ElevenLabs, it offers a hands-free, intelligent shopping journey where discovering and trying on fashion feels effortless.

## 🌟 Features

### 🤖 AI-Powered Shopping Assistant
- **Real-time Conversational AI**: Powered by Tavus AI for natural, human-like interactions
- **Voice Assistant**: ElevenLabs integration for seamless voice commands and responses
- **Visual AI**: AI agent that can see, hear, respond, and interact like a human
- **Smart Recommendations**: Personalized product suggestions based on preferences

### 🛒 Shopping Experience
- **Product Catalog**: Browse through curated fashion collections
- **Smart Search**: AI-enhanced search functionality
- **Category Navigation**: Organized product categories for easy browsing
- **Shopping Cart**: Full cart management with quantity controls
- **Wishlist**: Save favorite items for later

### 👤 User Experience
- **User Authentication**: Secure login and registration system
- **User Profiles**: Personalized user accounts and preferences
- **Dynamic Wallpapers**: Customizable background themes
- **Responsive Design**: Beautiful, modern UI with glass morphism effects
- **Mobile-First**: Optimized for all device sizes

### 🎨 Visual Features
- **Glass Morphism UI**: Modern, translucent design elements
- **Dynamic Backgrounds**: Crystal clear, customizable wallpapers
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Video Integration**: Immersive video backgrounds and content

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### AI & Voice
- **Tavus AI** - Real-time conversational AI agent
- **ElevenLabs** - Advanced voice synthesis and recognition
- **Daily.co** - Real-time communication infrastructure

### State Management
- **React Context API** - Global state management
- **Custom Hooks** - Reusable stateful logic

### Additional Libraries
- **Axios** - HTTP client for API requests
- **React Icons** - Extended icon collection
- **Motion** - Animation library
- **React Canvas Confetti** - Celebration effects

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── home/            # Home page components
│   ├── pages/           # Page components
│   ├── animations/      # Animation components
│   ├── LandingPage.tsx  # Main landing page
│   ├── MainContent.tsx  # Main app content
│   ├── VoiceAssistant.tsx # Voice AI integration
│   └── ...
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication state
│   ├── ShoppingContext.tsx # Shopping cart & products
│   ├── VoiceContext.tsx # Voice assistant state
│   ├── WallpaperContext.tsx # Theme management
│   └── UserContext.tsx  # User profile state
├── data/               # Static data and mock data
├── lib/                # Utility libraries
├── services/           # API services
├── styles/             # Global styles
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd riya
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_TAVUS_API_KEY=your_tavus_api_key
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
   VITE_DAILY_API_KEY=your_daily_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🎯 Key Components

### LandingPage
The main entry point featuring:
- Stunning glass morphism design
- AI-powered video backgrounds
- Authentication integration
- Smooth animations and transitions

### VoiceAssistant
Real-time voice interaction featuring:
- Voice command recognition
- AI response generation
- Visual feedback and transcription
- Seamless integration with shopping features

### ShoppingContext
Comprehensive shopping state management:
- Product catalog management
- Cart and wishlist functionality
- Category filtering
- Price calculations

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS for styling with custom configurations for:
- Glass morphism effects
- Custom animations
- Responsive breakpoints
- Color schemes

### Vite Configuration
Optimized build configuration with:
- React plugin integration
- Dependency optimization
- Fast HMR (Hot Module Replacement)

## 🌐 API Integration

### Tavus AI Integration
- Real-time conversational AI
- Video avatar generation
- Natural language processing

### ElevenLabs Integration
- Voice synthesis
- Speech recognition
- Multi-language support

## 🎨 Design System

### Color Palette
- Primary: Cyan/Blue gradients
- Secondary: Purple/Teal accents
- Glass effects with transparency
- High contrast text for accessibility

### Typography
- Modern, clean font stack
- Responsive text sizing
- Proper hierarchy and spacing

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Tavus AI** - For providing cutting-edge conversational AI technology
- **ElevenLabs** - For advanced voice synthesis capabilities
- **Daily.co** - For real-time communication infrastructure
- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Support

For support, email support@snapstyler.com or join our community Discord.

---

**SnapStyler** - Redefining how you shop online with AI-powered conversations and effortless fashion discovery. 🛍️✨