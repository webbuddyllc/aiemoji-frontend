This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## AI Emoji Generator with Replicate Integration

This application uses Replicate API to generate 3D-style Fluent Emojis. The emojis are created using advanced AI models that produce high-quality, modern emoji designs.

### Features
- **3D-Style Fluent Emojis**: Generate modern, minimalist emoji designs with clean lines and subtle shadows
- **Direct Replicate Integration**: No backend required - connects directly to Replicate API
- **Responsive Design**: Mobile-first design with glass-morphism effects
- **Real-time Generation**: See your emojis generated in real-time

## Setup Instructions

### 1. Get Your Replicate API Token

1. Go to [Replicate.com](https://replicate.com) and sign up for an account
2. Navigate to your [API tokens page](https://replicate.com/account/api-tokens)
3. Create a new API token
4. Copy the token (it will look like `r8_...`)

### 2. Configure Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add your Replicate API token:

```bash
# Replicate API Configuration
REPLICATE_API_TOKEN=your_actual_replicate_api_token_here

# Replicate Model for 3D-Style Fluent Emojis
REPLICATE_MODEL_VERSION=5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Test Your Replicate Setup (Optional but Recommended)

Before running the full application, test your Replicate integration:

```bash
npm run test:replicate
```

This will:
- ✅ Verify your API token is configured
- 🎨 Generate a test emoji ("happy cat")
- 📡 Confirm the Replicate integration works
- 🖼️  Display the generated image URL

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

The application uses Replicate's AI models to generate 3D-style Fluent Emojis. When you enter a prompt:

1. Your text is enhanced with specific instructions for 3D-style design
2. The enhanced prompt is sent to Replicate's API
3. The AI model generates a high-quality emoji image
4. The result is displayed in the UI with metadata

### Model Configuration

- **Model**: Custom 3D-style emoji generation model
- **Resolution**: 768x768 pixels
- **Style**: Modern, minimalist, Fluent design
- **Background**: Transparent/white for flexibility

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
