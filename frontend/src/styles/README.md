# 🎨 Golden Basket Mart - Responsive Design System

## 🚀 **COMPLETE RESPONSIVE SYSTEM OVERVIEW**

### **📱 Breakpoints:**
- **xs**: 0px - 599px (Mobile)
- **sm**: 600px - 899px (Small Tablets)
- **md**: 900px - 1199px (Large Tablets/Small Desktops)
- **lg**: 1200px - 1535px (Desktops)
- **xl**: 1536px+ (Large Desktops)

### **🎯 Responsive Component Classes:**
- **Buttons**: `.btn-xs` to `.btn-xl` (32px → 72px height)
- **Text Fields**: `.input-xs` to `.input-xl` (32px → 72px height)
- **Icons**: `.icon-xs` to `.icon-xl` (16px → 48px size)
- **Form Fields**: `.form-xs` to `.form-xl` (32px → 72px height)
- **Cards**: `.card-xs` to `.card-xl` (120px → 360px min-height)
- **Navigation**: `.nav-xs` to `.nav-xl` (48px → 96px height)
- **Modals**: `.modal-xs` to `.modal-xl` (320px → 1280px width)
- **Tables**: `.table-xs` to `.table-xl` (0.75rem → 1.75rem font)
- **Chips**: `.chip-xs` to `.chip-xl` (20px → 44px height)
- **Alerts**: `.alert-xs` to `.alert-xl` (8px → 24px padding)
- **Breadcrumbs**: `.breadcrumb-xs` to `.breadcrumb-xl` (0.75rem → 1.75rem font)
- **Pagination**: `.pagination-xs` to `.pagination-xl` (28px → 52px height)
- **Tooltips**: `.tooltip-xs` to `.tooltip-xl` (0.625rem → 1.625rem font)

### **📏 Responsive Spacing & Typography:**
- **Typography**: `.text-xs` to `.text-4xl` (0.75rem → 4rem font)
- **Spacing**: `.p-xs` to `.p-xl`, `.m-xs` to `.p-xl` (8px → 80px)
- **Gaps**: `.gap-xs` to `.gap-xl` (8px → 80px)
- **Borders**: `.border-xs` to `.border-xl` (1px → 6px width)
- **Radius**: `.rounded-xs` to `.rounded-xl` (4px → 40px radius)

### **🎨 Theme Integration:**
- **Border Colors**: `.border-primary`, `.border-success`, `.border-error`, etc.
- **Combined Classes**: `.rounded-border-primary-sm`, `.rounded-border-error-xs`
- **CSS Variables**: All colors use `var(--color-*)` for theme switching

---

## Why This Approach?

### ❌ **Problems with Inline Responsive Styles:**

1. **Scattered Media Queries**: Every component has its own responsive logic
2. **Inconsistent Breakpoints**: Different components use different responsive values
3. **Hard to Maintain**: Changes require updating multiple files
4. **Code Duplication**: Same responsive patterns repeated everywhere
5. **No Standardization**: Every developer implements responsive differently

### ✅ **Benefits of Centralized System:**

1. **Single Source of Truth**: All responsive logic in one place
2. **Consistent Breakpoints**: Standard Material-UI breakpoints
3. **Easy to Maintain**: Change once, affects everywhere
4. **Reusable Patterns**: Common responsive utilities
5. **Better Performance**: CSS media queries vs JavaScript calculations

## How to Use

### 1. **CSS Classes (Recommended)**

```css
/* Use utility classes instead of inline responsive styles */
<div class="hidden-xs visible-md">Desktop Only</div>
<div class="grid-2 grid-3 grid-4">Responsive Grid</div>
<div class="text-sm text-lg text-xl">Responsive Typography</div>
```

### 2. **CSS Variables**

```css
/* Use CSS variables for consistent spacing */
.container {
  padding: var(--container-padding);
  margin-bottom: var(--section-spacing);
}
```

### 3. **JavaScript Utilities (For Complex Cases)**

```javascript
import { spacing, typography, display } from '../styles/responsive';

// Use predefined responsive values
const buttonStyles = {
  padding: spacing.md,        // { xs: 3, sm: 4, md: 6, lg: 8, xl: 10 }
  fontSize: typography.h4,    // { xs: '1.125rem', sm: '1.25rem', ... }
  display: display.mobileOnly // { xs: 'block', sm: 'block', md: 'none', ... }
};
```

## Migration Guide

### **Before (Inline Responsive):**
```javascript
// ❌ Don't do this anymore
sx={{
  display: { xs: 'none', md: 'flex' },
  fontSize: { xs: '1rem', md: '1.5rem' },
  padding: { xs: 2, md: 4 }
}}
```

### **After (Centralized System):**
```javascript
// ✅ Do this instead
sx={{
  display: 'hidden-xs visible-md',
  fontSize: 'text-base text-lg',
  padding: 'p-md p-lg'
}}
```

## Available Utilities

### **Display Classes:**
- `.hidden-xs`, `.hidden-sm`, `.hidden-md`, `.hidden-lg`, `.hidden-xl`
- `.visible-xs`, `.visible-sm`, `.visible-md`, `.visible-lg`, `.visible-xl`
- `.mobile-only`, `.desktop-only`

### **Grid Classes:**
- `.grid`, `.grid-cols-1`, `.grid-cols-2`, `.grid-cols-3`, `.grid-cols-4`, `.grid-cols-5`
- `.sidebar-layout`
- `.gap-xs`, `.gap-sm`, `.gap-md`, `.gap-lg`, `.gap-xl`

### **Flexbox Classes:**
- `.flex`, `.flex-col`, `.flex-row`, `.flex-wrap`, `.flex-nowrap`
- `.items-start`, `.items-center`, `.items-end`, `.items-stretch`
- `.justify-start`, `.justify-center`, `.justify-end`, `.justify-between`, `.justify-around`, `.justify-evenly`

### **Spacing Classes:**
- **Padding**: `.p-xs`, `.p-sm`, `.p-md`, `.p-lg`, `.p-xl`
- **Padding X**: `.px-xs`, `.px-sm`, `.px-md`, `.px-lg`, `.px-xl`
- **Padding Y**: `.py-xs`, `.py-sm`, `.py-md`, `.py-lg`, `.py-xl`
- **Margins**: `.m-xs`, `.m-sm`, `.m-md`, `.m-lg`, `.m-xl`
- **Margin X**: `.mx-xs`, `.mx-sm`, `.mx-md`, `.mx-lg`, `.mx-xl`
- **Margin Y**: `.my-xs`, `.my-sm`, `.my-md`, `.my-lg`, `.my-xl`
- **Individual Margins**: `.mt-*`, `.mb-*`, `.ml-*`, `.mr-*`

### **Typography Classes:**
- **Sizes**: `.text-xs`, `.text-sm`, `.text-base`, `.text-lg`, `.text-xl`, `.text-2xl`, `.text-3xl`, `.text-4xl`
- **Weights**: `.font-light`, `.font-normal`, `.font-medium`, `.font-semibold`, `.font-bold`, `.font-extrabold`
- **Alignment**: `.text-left`, `.text-center`, `.text-right`, `.text-justify`
- **Line Height**: `.leading-tight`, `.leading-snug`, `.leading-normal`, `.leading-relaxed`, `.leading-loose`

### **Layout Classes:**
- **Position**: `.relative`, `.absolute`, `.fixed`, `.sticky`
- **Z-Index**: `.z-0`, `.z-10`, `.z-20`, `.z-30`, `.z-40`, `.z-50`
- **Overflow**: `.overflow-hidden`, `.overflow-auto`, `.overflow-scroll`, `.overflow-x-auto`, `.overflow-y-auto`

### **🎯 CENTRALIZED BORDER & RADIUS SYSTEM:**

#### **Border Radius Classes (Responsive):**
- **Base**: `.rounded-xs` to `.rounded-xl`, `.rounded-full`, `.rounded-none`
- **Responsive Scaling**: Automatically scales up across breakpoints
  - Mobile: `.rounded-sm` = `8px`
  - Small: `.rounded-sm` = `10px` 
  - Medium: `.rounded-sm` = `12px`
  - Large: `.rounded-sm` = `14px`
  - Extra Large: `.rounded-sm` = `16px`

#### **Border Width Classes:**
- `.border-none`, `.border-xs` (1px), `.border-sm` (2px), `.border-md` (3px), `.border-lg` (4px), `.border-xl` (6px)

#### **Border Style Classes:**
- `.border-solid`, `.border-dashed`, `.border-dotted`, `.border-double`

#### **Border Color Classes:**
- **Theme-based**: `.border-primary`, `.border-primary-light`, `.border-primary-dark`
- **Status**: `.border-success`, `.border-warning`, `.border-error`
- **Utility**: `.border-divider`, `.border-text`

#### **Complete Border Utilities:**
- **Combined**: `.border-primary-sm` = `2px solid var(--color-primary)`
- **Radius + Border**: `.rounded-border-primary-sm` = `8px radius + 2px primary border`
- **Responsive**: All combinations scale appropriately across breakpoints

### **🎯 RESPONSIVE COMPONENT SIZING:**

#### **Button Sizes (Responsive):**
- **Mobile**: `.btn-md` = `40px height, 1rem font`
- **Small**: `.btn-md` = `44px height, 1.125rem font`
- **Medium**: `.btn-md` = `48px height, 1.25rem font`
- **Large**: `.btn-md` = `52px height, 1.375rem font`
- **Extra Large**: `.btn-md` = `56px height, 1.5rem font`

#### **Text Field Sizes (Responsive):**
- **Mobile**: `.input-md` = `40px height, 1rem font`
- **Small**: `.input-md` = `44px height, 1.125rem font`
- **Medium**: `.input-md` = `48px height, 1.25rem font`
- **Large**: `.input-md` = `52px height, 1.375rem font`
- **Extra Large**: `.input-md` = `56px height, 1.5rem font`

#### **Icon Sizes (Responsive):**
- **Mobile**: `.icon-md` = `24px, 1.25rem font`
- **Small**: `.icon-md` = `26px, 1.375rem font`
- **Medium**: `.icon-md` = `28px, 1.5rem font`
- **Large**: `.icon-md` = `30px, 1.625rem font`
- **Extra Large**: `.icon-md` = `32px, 1.75rem font`

#### **Form Field Sizes (Responsive):**
- **Mobile**: `.form-md` = `40px height, 1rem font`
- **Small**: `.form-md` = `44px height, 1.125rem font`
- **Medium**: `.form-md` = `48px height, 1.25rem font`
- **Large**: `.form-md` = `52px height, 1.375rem font`
- **Extra Large**: `.form-md` = `56px height, 1.5rem font`

#### **Card Sizes (Responsive):**
- **Mobile**: `.card-md` = `200px min-height, 20px padding`
- **Small**: `.card-md` = `220px min-height, 24px padding`
- **Medium**: `.card-md` = `240px min-height, 28px padding`
- **Large**: `.card-md` = `260px min-height, 32px padding`
- **Extra Large**: `.card-md` = `280px min-height, 36px padding`

#### **Navigation Sizes (Responsive):**
- **Mobile**: `.nav-md` = `64px height, 16px padding`
- **Small**: `.nav-md` = `68px height, 18px padding`
- **Medium**: `.nav-md` = `72px height, 20px padding`
- **Large**: `.nav-md` = `76px height, 22px padding`
- **Extra Large**: `.nav-md` = `80px height, 24px padding`

#### **Modal Sizes (Responsive):**
- **Mobile**: `.modal-md` = `640px max-width, 24px padding`
- **Small**: `.modal-md` = `680px max-width, 28px padding`
- **Medium**: `.modal-md` = `720px max-width, 32px padding`
- **Large**: `.modal-md` = `760px max-width, 36px padding`
- **Extra Large**: `.modal-md` = `800px max-width, 40px padding`

#### **Table Sizes (Responsive):**
- **Mobile**: `.table-md` = `1rem font, 12px padding`
- **Small**: `.table-md` = `1.125rem font, 14px padding`
- **Medium**: `.table-md` = `1.25rem font, 16px padding`
- **Large**: `.table-md` = `1.375rem font, 18px padding`
- **Extra Large**: `.table-md` = `1.5rem font, 20px padding`

#### **Chip Sizes (Responsive):**
- **Mobile**: `.chip-md` = `28px height, 0.875rem font`
- **Small**: `.chip-md` = `30px height, 1rem font`
- **Medium**: `.chip-md` = `32px height, 1.125rem font`
- **Large**: `.chip-md` = `34px height, 1.25rem font`
- **Extra Large**: `.chip-md` = `36px height, 1.375rem font`

#### **Alert Sizes (Responsive):**
- **Mobile**: `.alert-md` = `12px 20px padding, 1rem font`
- **Small**: `.alert-md` = `14px 22px padding, 1.125rem font`
- **Medium**: `.alert-md` = `16px 24px padding, 1.25rem font`
- **Large**: `.alert-md` = `18px 26px padding, 1.375rem font`
- **Extra Large**: `.alert-md` = `20px 28px padding, 1.5rem font`

#### **Breadcrumb Sizes (Responsive):**
- **Mobile**: `.breadcrumb-md` = `1rem font, 8px 12px padding`
- **Small**: `.breadcrumb-md` = `1.125rem font, 10px 14px padding`
- **Medium**: `.breadcrumb-md` = `1.25rem font, 12px 16px padding`
- **Large**: `.breadcrumb-md` = `1.375rem font, 14px 18px padding`
- **Extra Large**: `.breadcrumb-md` = `1.5rem font, 16px 20px padding`

#### **Pagination Sizes (Responsive):**
- **Mobile**: `.pagination-md` = `36px height, 1rem font`
- **Small**: `.pagination-md` = `38px height, 1.125rem font`
- **Medium**: `.pagination-md` = `40px height, 1.25rem font`
- **Large**: `.pagination-md` = `42px height, 1.375rem font`
- **Extra Large**: `.pagination-md` = `44px height, 1.5rem font`

#### **Tooltip Sizes (Responsive):**
- **Mobile**: `.tooltip-md` = `0.875rem font, 8px 10px padding`
- **Small**: `.tooltip-md` = `1rem font, 9px 11px padding`
- **Medium**: `.tooltip-md` = `1.125rem font, 10px 12px padding`
- **Large**: `.tooltip-md` = `1.25rem font, 11px 13px padding`
- **Extra Large**: `.tooltip-md` = `1.375rem font, 12px 14px padding`

### **Visual Classes:**
- **Shadows**: `.shadow-xs`, `.shadow-sm`, `.shadow-md`, `.shadow-lg`, `.shadow-xl`
- **Width/Height**: `.w-full`, `.w-auto`, `.w-xs`, `.w-sm`, `.w-md`, `.w-lg`, `.w-xl`
- **Cursor**: `.cursor-pointer`, `.cursor-default`, `.cursor-not-allowed`

### **Breakpoint-Specific Classes:**
- **Small (600px+)**: `.sm:p-sm`, `.sm:text-base`, `.sm:grid-cols-2`
- **Medium (900px+)**: `.md:p-md`, `.md:text-lg`, `.md:flex-row`, `.md:grid-cols-3`
- **Large (1200px+)**: `.lg:p-lg`, `.lg:text-xl`, `.lg:grid-cols-4`
- **Extra Large (1536px+)**: `.xl:p-xl`, `.xl:text-2xl`, `.xl:grid-cols-5`

## Breakpoints

```javascript
export const BREAKPOINTS = {
  xs: 0,      // 0px and up
  sm: 600,    // 600px and up
  md: 900,    // 900px and up
  lg: 1200,   // 1200px and up
  xl: 1536,   // 1536px and up
};
```

## Best Practices

1. **Use CSS Classes First**: Prefer utility classes over inline styles
2. **Mobile First**: Design for mobile, enhance for larger screens
3. **Consistent Spacing**: Use predefined spacing values
4. **Semantic Names**: Use descriptive class names
5. **Performance**: CSS media queries are faster than JavaScript

## Examples

### **Responsive Navigation:**
```javascript
// Instead of inline responsive styles
<Box sx={{ display: { xs: 'none', md: 'flex' } }}>
  Navigation
</Box>

// Use utility classes
<Box className="hidden-xs visible-md">
  Navigation
</Box>
```

### **Responsive Grid:**
```javascript
// Instead of complex responsive logic
<Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>

// Use predefined grid classes
<div className="grid-2 grid-3 grid-4">
  Grid Items
</div>
```

### **Responsive Typography:**
```javascript
// Instead of inline responsive typography
<Typography sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>

// Use typography classes
<Typography className="text-base text-lg">
  Responsive Text
</Typography>
```

### **Responsive Layout:**
```javascript
// Instead of complex responsive styles
<Box sx={{
  flexDirection: { xs: 'column', md: 'row' },
  gap: { xs: 2, md: 4 },
  padding: { xs: 2, md: 4 }
}}>

// Use utility classes
<Box className="flex flex-col md:flex-row gap-sm md:gap-md p-sm md:p-md">
  Content
</Box>
```

### **Responsive Cards:**
```javascript
// Instead of inline responsive styles
<Card sx={{
  marginBottom: { xs: 2, md: 3 },
  borderRadius: { xs: 1, md: 2 }
}}>

// Use utility classes
<Card className="mb-sm md:mb-md rounded-sm md:rounded-md">
  Card Content
</Card>
```

### **Responsive Buttons:**
```javascript
// Instead of complex responsive logic
<Button sx={{
  fontSize: { xs: '0.875rem', md: '1rem' },
  padding: { xs: '8px 16px', md: '12px 24px' }
}}>

// Use utility classes
<Button className="text-sm md:text-base p-sm md:p-md">
  Click Me
</Button>
```

### **🎯 Centralized Border System:**
```javascript
// Instead of scattered border definitions
<Box sx={{
  border: '2px solid #2196F3',
  borderRadius: 8,
  borderWidth: '2px'
}}>

// Use centralized border utilities
<Box className="rounded-border-primary-sm">
  Content with consistent borders
</Box>

// Or combine individual utilities
<Box className="rounded-sm border-primary-sm border-solid">
  Custom border combination
</Box>

// Responsive borders that scale automatically
<Card className="rounded-border-primary-light-sm">
  {/* 
    Mobile: 8px radius + 2px primary-light border
    Small: 10px radius + 2px primary-light border  
    Medium: 12px radius + 2px primary-light border
    Large: 14px radius + 2px primary-light border
    Extra Large: 16px radius + 2px primary-light border
  */}
</Card>
```

### **🎯 Responsive Component Sizing:**
```javascript
// Instead of fixed component sizes
<Button sx={{ height: 40, fontSize: '1rem' }}>
  Click Me
</Button>

<TextField sx={{ height: 40, fontSize: '1rem' }} />

<Icon sx={{ fontSize: 24 }} />

// Use responsive sizing classes
<Button className="btn-md">
  {/* 
    Mobile: 40px height, 1rem font
    Small: 44px height, 1.125rem font
    Medium: 48px height, 1.25rem font
    Large: 52px height, 1.375rem font
    Extra Large: 56px height, 1.5rem font
  */}
  Click Me
</Button>

<TextField className="input-md" />
<Icon className="icon-md" />

// Combine with other responsive utilities
<Button className="btn-lg rounded-md border-primary-sm">
  Large Responsive Button
</Button>
```

## Migration Steps

1. **Replace inline responsive styles** with utility classes
2. **Update component imports** to use responsive utilities
3. **Test across all breakpoints** to ensure consistency
4. **Remove old responsive logic** from components
5. **Document any custom responsive patterns**

This system will make your codebase much cleaner, more maintainable, and performant!
