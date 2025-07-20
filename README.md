# QR Code Generator

A modern, animated QR code generator built with Next.js, React, and Tailwind CSS.

## Features

- Generate QR codes from any link or plain text
- Animated dot grid background
- Option to show the destination website's favicon/logo in the center of the QR code (auto-detects from URL)
- Toggle to show/hide the logo in the QR code
- Download the generated QR code as a PNG
- Responsive, dark-themed UI

## Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) for QR code rendering
- [faviconkit.com](https://faviconkit.com/) for dynamic favicon fetching

## Setup

1. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Usage

- Enter a URL or any text in the input field.
- Click the arrow button to generate a QR code.
- (Optional) Use the "Show logo" toggle to display the website's favicon in the center of the QR code (works for most public sites).
- Click "Download as PNG" to save the QR code image.
- Click "Clear" to reset the input and QR code.

## Notes
- The logo in the QR code is fetched dynamically using the website's favicon (via faviconkit.com). If the favicon is not available, no logo is shown.
- For best results, use valid URLs (e.g., `https://github.com/username`).
- The app is fully client-side and does not store or track any data.

## Customization
- To use a custom default logo, replace `public/logo.png` with your own PNG image.
- You can adjust the QR code and logo size in the code (`imageSize` in `BlobsQRCode`).

---

Built with ❤️ by [Your Name]
