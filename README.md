# 💼 Invoice Management Application

A modern, fully functional Invoice Management Application built with React, TypeScript, TailwindCSS, and local storage persistence. This application provides users with a complete CRUD system for managing invoices with validation, theme support, and responsive design.

## 🚀 Features

### Core Functionality
- ✅ **CRUD Operations**: Create, Read, Update, and Delete invoices
- ✅ **Form Validation**: Comprehensive validation using Zod with react-hook-form
- ✅ **Invoice Status Management**: Draft, Pending, and Paid statuses
- ✅ **Status Filtering**: Filter invoices by All, Draft, Pending, or Paid
- ✅ **Search**: Search invoices by invoice number or client name
- ✅ **Data Persistence**: LocalStorage integration with structured data management
- ✅ **Dark/Light Mode**: Theme toggle with persistence
- ✅ **Responsive Design**: Mobile (320px+), Tablet (768px+), Desktop (1024px+)
- ✅ **Hover States**: Interactive feedback on all interactive elements
- ✅ **Accessibility**: WCAG AA compliant with proper semantics

### Additional Features
- Invoice detail view with line-by-line breakdown
- Real-time total calculation
- Delete confirmation dialog with focus management
- Status transition controls (Draft → Pending → Paid)
- Automatic date initialization (Issue date and due date calculations)
- Currency formatting with internationalization

## 📋 Project Structure

```
src/
├── components/         # Reusable React components
│   ├── Header.tsx
│   ├── InvoiceFilter.tsx
│   ├── InvoiceCard.tsx
│   ├── InvoiceListView.tsx
│   ├── InvoiceForm.tsx
│   ├── FormInput.tsx
│   ├── StatusBadge.tsx
│   └── ConfirmDialog.tsx
├── context/           # React Context providers
│   └── ThemeContext.tsx
├── hooks/            # Custom React hooks
│   └── useInvoices.ts
├── pages/            # Page components
│   ├── HomePage.tsx
│   ├── InvoiceDetailPage.tsx
│   └── InvoiceFormPage.tsx
├── types/            # TypeScript type definitions
│   └── invoice.ts
├── utils/            # Utility functions
│   ├── storage.ts      # LocalStorage management
│   ├── validation.ts   # Zod validation schemas
│   └── helpers.ts      # Helper functions
├── App.tsx           # Main app component with routing
├── main.tsx          # React DOM entry point
├── index.css         # Tailwind and custom styles
└── App.css          # App-specific styles
```

## 🛠️ Tech Stack

### Core
- **React 18**: UI library with hooks
- **TypeScript**: Static type checking
- **Vite**: Lightning-fast build tool
- **React Router**: Client-side routing

### Styling
- **TailwindCSS**: Utility-first CSS framework
- **PostCSS**: CSS processing

### Form & Validation
- **react-hook-form**: Performant form library
- **Zod**: TypeScript-first schema validation

### Icons
- **lucide-react**: Modern icon library

## 📦 Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173/`

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎯 User Guide

### Creating an Invoice
1. Click "New Invoice" button in the header
2. Fill in required client information
3. Add line items (description, quantity, price)
4. Set issue and due dates
5. Add optional notes
6. Click "Create Invoice"

### Managing Invoices
- **View**: Click on an invoice card to see details
- **Edit**: Click edit button on invoice detail page
- **Delete**: Click delete button (requires confirmation)
- **Status**: Change status using the status buttons

### Filtering & Search
- Use status filters (All, Draft, Pending, Paid) to view specific invoices
- Search by invoice number or client name in real-time

### Theme
- Toggle between light and dark mode using the sun/moon icon
- Preference is saved to localStorage

## ✨ Validation Rules

### Invoice Form
- **Invoice Number**: Required, max 50 characters
- **Client Name**: Required
- **Client Email**: Required, valid email format
- **Phone**: Optional
- **Address**: Optional
- **Issue Date**: Required
- **Due Date**: Required
- **Items**: At least one item required
  - Description: Required
  - Quantity: Required, greater than 0
  - Price: Required, greater than 0
- **Notes**: Optional

## ♿ Accessibility Features

- ✅ Semantic HTML (form fields, buttons, labels)
- ✅ ARIA labels and descriptions
- ✅ Focus management in modals
- ✅ Keyboard navigation (ESC to close modals)
- ✅ Error messages associated with form fields
- ✅ Color contrast ratios meet WCAG AA standards
- ✅ Disabled state visual feedback
- ✅ Proper heading hierarchy

## 📱 Responsive Design

The application is fully responsive:
- **Mobile (320px+)**: Stacked layouts, single-column forms
- **Tablet (768px+)**: Two-column layouts, flexible spacing
- **Desktop (1024px+)**: Full multi-column layouts, optimized hover states

## 🔒 Data Persistence

All data is stored in the browser's localStorage:
- **Invoices**: Stored under `invoices_db` key
- **Theme**: Stored under `theme_preference` key

No backend is required - all data persists on the device.

## 🚀 Performance Optimizations

- Lazy loading of components with React Router
- Efficient form handling with react-hook-form
- Memoized components to prevent unnecessary re-renders
- LocalStorage for instant data persistence
- Tailwind CSS for optimized styling

## 🏗️ Architecture Decisions

### Frontend-Only Design
- **Why**: Stage 2 focus on frontend skills
- **Trade-off**: Data isolated to single browser/device
- **Pro**: No backend dependencies, faster deployment

### LocalStorage Over IndexedDB
- **Why**: Simpler implementation, adequate for application scope
- **Consideration**: Could upgrade to IndexedDB for larger datasets

### React Context for Theme
- **Why**: Lightweight, no external state management needed
- **Scale**: Perfect for this application size

### TailwindCSS for Styling
- **Why**: Rapid development, consistent design system
- **Benefit**: Small bundle size, utility-first approach

## 🔧 Troubleshooting

### Data Not Persisting
- Check if localStorage is enabled in browser
- Clear browser cache and retry
- Check DevTools > Application > LocalStorage

### Styling Issues
- Clear browser cache (Ctrl+Shift+R)
- Restart dev server
- Verify Tailwind CSS is loaded

### Form Validation Not Working
- Check browser console for error messages
- Verify all required fields are filled
- Check email format is correct

## 📊 Future Enhancements

- Backend API with database
- CSV/PDF export functionality
- Email invoice sending
- Multi-user support with authentication
- Tax and discount calculations
- Invoice templates
- Payment gateway integration
- Real-time collaboration

## 📝 Development Notes

### Type Safety
- Full TypeScript support
- Type-safe form handling with Zod
- Strict null checks enabled

### Testing Ready
- Can be extended with Jest + React Testing Library
- Modular component structure
- Utility functions easily testable

### Code Quality
- ESLint configuration included
- React best practices followed
- Accessible component patterns

## 🌐 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox
- ES2020+ JavaScript features

## 📄 License

This project is provided for educational purposes.

---

**Ready to manage invoices like a pro! 💼✨**
```
