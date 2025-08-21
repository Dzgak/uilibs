# UI Libraries Explorer 🎨

A modern, community-driven platform for discovering and sharing Roblox UI component libraries. Built with Next.js, Supabase, and TypeScript.

![UI Libraries Explorer](https://img.shields.io/badge/Status-Beta-orange)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)

## 🤝 How to Support

### Financial Support

If you find this project helpful, consider supporting its development:

- **PayPal (Family & Friends)**: dev.xrer@gmail.com
- **LTC**: LbWTXDo5oSN2PSjUf4GqZTBM89178rtNbv

### Contributing

We welcome contributions! Here's how you can help:

#### 🐛 Report Bugs
1. Check existing issues first
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

#### 💡 Suggest Features
1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Mockups or examples if possible

#### 🔧 Submit Code
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

#### 📚 Improve Documentation
- Fix typos and grammar
- Add missing information
- Create tutorials and guides
- Translate to other languages

#### 🎨 Design & UX
- Improve user interface
- Create new components
- Optimize for accessibility
- Add animations and interactions

### Community

- **Discord**: https://discord.gg/AM4ZMgZJtV

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the amazing backend platform
- **Next.js** for the excellent React framework
- **Tailwind CSS** for the utility-first styling
- **All contributors** who help improve this project



---

**Made with ❤️ by XRER**

*If you find this project useful, please give it a ⭐ on GitHub!*


## 🌟 Features

### For Users
- **Browse Libraries**: Discover UI component libraries with rich previews and descriptions
- **Search & Filter**: Advanced search with tags, paid/free filters, and mobile-friendly options
- **Favorites**: Save your favorite libraries for quick access
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes for comfortable browsing

### For Contributors
- **Upload Libraries**: Share your own UI libraries with the community
- **Manage Content**: Edit and update your uploaded libraries
- **Image Galleries**: Upload multiple preview images for your libraries
- **Rich Descriptions**: Use markdown for detailed library descriptions
- **Tags & Categories**: Organize libraries with custom tags

### For Admins
- **Full Management**: Manage all libraries in the system
- **User Management**: Oversee user contributions
- **Content Moderation**: Review and approve library submissions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dzgak/uilibs.git
   cd uilibs-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_URL=https://your-domain.com
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations in `supabase/migrations/`
   - Configure storage buckets for library images
   - Set up authentication providers

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 How It Works

### Authentication System
- **Supabase Auth**: Handles user registration and login
- **Role-based Access**: Users can upload libraries, admins can manage all content
- **Protected Routes**: Middleware ensures proper access control

### Database Schema
```sql
-- Libraries table
CREATE TABLE libraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  about TEXT,
  author TEXT NOT NULL,
  author_bio TEXT,
  website TEXT,
  github TEXT,
  preview TEXT,
  gallery TEXT[],
  tags TEXT[] DEFAULT '{}',
  is_paid BOOLEAN DEFAULT false,
  is_mobile_friendly BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Image Management
- **Supabase Storage**: Stores library preview images and galleries
- **Automatic Resizing**: Images are optimized for different screen sizes
- **Drag & Drop**: Easy image upload with drag-and-drop interface

### Search & Filtering
- **Full-text Search**: Search by library name, description, author, and tags
- **Advanced Filters**: Filter by paid/free, mobile-friendly, and custom tags
- **Real-time Results**: Instant search results as you type

## 📝 How to Update

### Adding New Features

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Add new components in `components/`
   - Create new pages in `app/`
   - Update database schema if needed

3. **Test your changes**
   ```bash
   npm run build
   npm run lint
   ```

4. **Submit a pull request**
   - Describe your changes clearly
   - Include screenshots if UI changes
   - Test on different devices

### Database Updates

1. **Create a new migration**
   ```bash
   # Create migration file
   touch supabase/migrations/YYYYMMDDHHMMSS_description.sql
   ```

2. **Write your SQL**
   ```sql
   -- Example migration
   ALTER TABLE libraries ADD COLUMN new_field TEXT;
   ```

3. **Apply the migration**
   ```bash
   # In Supabase dashboard or CLI
   supabase db push
   ```

### Environment Updates

1. **Update environment variables**
   ```env
   # Add new variables to .env.local
   NEW_API_KEY=your_new_key
   ```

2. **Update deployment environment**
   - Update Vercel/Netlify environment variables
   - Update Supabase environment variables

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Automatic code formatting
- **Conventional Commits**: Standard commit message format

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository**
   - Link your GitHub repository to Vercel
   - Configure environment variables

2. **Deploy**
   ```bash
   npm run build
   # Vercel will automatically deploy on push to main
   ```

### Other Platforms

- **Netlify**: Similar to Vercel setup
- **Railway**: Good for full-stack deployments
- **DigitalOcean**: Manual deployment with Docker