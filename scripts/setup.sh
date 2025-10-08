#!/bin/bash

echo "🚀 Setting up MobileLauncher React Native Boilerplate..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create necessary directories if they don't exist
echo "📁 Creating directories..."
mkdir -p src/{features/{auth/{api,components,hooks,screens,services,store,types},onboarding/{api,components,hooks,screens,services,store,types},home/{api,components,hooks,screens,services,store,types},settings/{api,components,hooks,screens,services,store,types}},navigation/{navigators},services/{api,storage,logging},store,ui/{components,style,tokens},utils,schemas,config,entrypoints,locales}

echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm start"
echo ""
echo "To run on specific platforms:"
echo "  npm run ios"
echo "  npm run android"
echo "  npm run web"
echo ""
echo "Happy coding! 🎉"
