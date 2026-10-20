# سیستم طراحی سبز بازیافت

## 🎨 Design System Overview

این پروژه از یک سیستم طراحی یکپارچه استفاده می‌کند که تمام ایرادات استایل و طراحی را برطرف کرده است.

## 📋 ویژگی‌های سیستم طراحی

### ۱. پالت رنگی یکپارچه
- **Primary Colors**: Emerald (سبز) - رنگ اصلی برند
- **Semantic Colors**: Success, Warning, Error, Info
- **Neutral Colors**: خاکستری‌های استاندارد برای متن و پس‌زمینه

### ۲. Border Radius System
```css
--radius-xs: 4px;
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-2xl: 24px;
--radius-3xl: 32px;
--radius-full: 9999px;
```

### ۳. Shadow System (Elevation)
```css
--shadow-xs: سایه بسیار کوچک
--shadow-sm: سایه کوچک
--shadow-md: سایه متوسط
--shadow-lg: سایه بزرگ
--shadow-xl: سایه خیلی بزرگ
--shadow-2xl: سایه بسیار بزرگ
--shadow-primary: سایه رنگ اصلی
```

### ۴. Spacing Scale
```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

### ۵. Typography Scale
```css
--text-xs: 12px
--text-sm: 14px
--text-base: 16px
--text-lg: 18px
--text-xl: 20px
--text-2xl: 24px
--text-3xl: 30px
--text-4xl: 36px
--text-5xl: 48px
--text-6xl: 60px
```

### ۶. Transition System
```css
--transition-fast: 150ms
--transition-base: 300ms
--transition-slow: 500ms
```

### ۷. Z-Index Scale
```css
--z-dropdown: 1000
--z-sticky: 1020
--z-fixed: 1030
--z-modal-backdrop: 1040
--z-modal: 1050
--z-popover: 1060
--z-tooltip: 1070
--z-toast: 1080
```

## 🎯 Component Classes

### Button Classes
```css
.btn-primary    - دکمه اصلی با گرادیانت سبز
.btn-secondary  - دکمه ثانویه با پس‌زمینه خاکستری
```

### Card Classes
```css
.card           - کارت استاندارد با سایه و hover effect
.card-hover     - کارت با افکت hover
```

### Input Classes
```css
.input-field    - فیلد ورودی استاندارد
```

### Badge Classes
```css
.badge          - بج استاندارد
.badge-primary  - بج رنگ اصلی
.badge-warning  - بج هشدار
.badge-error    - بج خطا
.badge-success  - بج موفقیت
```

## 🎨 Color Usage Guidelines

### Primary Color (Emerald)
- استفاده برای: دکمه‌های اصلی، لینک‌ها، آیکون‌های مهم
- کلاس‌ها: `bg-primary-500`, `text-primary-700`, `border-primary-200`

### Warning Color (Amber)
- استفاده برای: امتیازها، هشدارها، اعلان‌ها
- کلاس‌ها: `bg-warning`, `text-warning`

### Error Color (Red)
- استفاده برای: خطاها، حذف، اخطارها
- کلاس‌ها: `bg-error`, `text-error`

### Neutral Colors
- استفاده برای: متن‌ها، پس‌زمینه‌ها، border‌ها
- کلاس‌ها: `text-neutral-600`, `bg-neutral-100`, `border-neutral-200`

## 📐 Spacing Guidelines

### Padding
- کوچک: `p-2`, `p-3`
- متوسط: `p-4`, `p-6`
- بزرگ: `p-8`, `p-12`

### Gap
- کوچک: `gap-2`, `gap-3`
- متوسط: `gap-4`, `gap-6`
- بزرگ: `gap-8`

### Margin
- کوچک: `m-2`, `m-3`
- متوسط: `m-4`, `m-6`
- بزرگ: `m-8`, `m-12`

## 🔤 Typography Guidelines

### Headings
- `text-4xl font-black` - عنوان اصلی صفحه
- `text-3xl font-bold` - عنوان بخش
- `text-2xl font-bold` - عنوان زیربخش
- `text-xl font-bold` - عنوان کارت

### Body Text
- `text-base` - متن اصلی
- `text-sm` - متن کوچک
- `text-xs` - متن بسیار کوچک

### Font Weights
- `font-normal` - متن عادی
- `font-medium` - متن متوسط
- `font-bold` - متن پررنگ
- `font-black` - متن بسیار پررنگ

## 🎭 Shadow Guidelines

### Elevation Levels
- `shadow-sm` - کارت‌های کوچک
- `shadow-md` - کارت‌های متوسط
- `shadow-lg` - کارت‌های بزرگ
- `shadow-xl` - مودال‌ها
- `shadow-2xl` - عناصر خیلی برجسته

## 🌊 Border Radius Guidelines

### Usage
- `rounded-sm` - دکمه‌های کوچک، badge‌ها
- `rounded-md` - input‌ها
- `rounded-lg` - کارت‌های کوچک
- `rounded-xl` - کارت‌های متوسط
- `rounded-2xl` - کارت‌های بزرگ
- `rounded-3xl` - مودال‌ها
- `rounded-full` - آواتارها، badge‌های گرد

## 🎬 Animation Guidelines

### Transition Duration
- `transition-fast` - hover‌های سریع
- `transition-base` - انیمیشن‌های استاندارد
- `transition-slow` - انیمیشن‌های آرام

### Hover Effects
- `hover:scale-105` - بزرگنمایی ملایم
- `hover:shadow-lg` - افزایش سایه
- `hover:bg-primary-50` - تغییر پس‌زمینه

## 📱 Responsive Design

### Breakpoints
- `sm:` - 640px (موبایل بزرگ)
- `md:` - 768px (تبلت)
- `lg:` - 1024px (لپ‌تاپ)
- `xl:` - 1280px (دسکتاپ)

### Container Sizes
- `max-w-sm` - 640px
- `max-w-md` - 768px
- `max-w-lg` - 1024px
- `max-w-xl` - 1280px
- `max-w-2xl` - 1536px

## ✅ Best Practices

### ۱. استفاده از Design Tokens
همیشه از متغیرهای CSS استفاده کنید، نه مقادیر hardcoded.

### ۲. Semantic Colors
از رنگ‌های معنایی استفاده کنید:
- `text-error` به جای `text-red-500`
- `bg-success` به جای `bg-green-500`

### ۳. Consistent Spacing
از مقیاس spacing استاندارد استفاده کنید.

### ۴. Unified Shadows
از سیستم shadow یکپارچه استفاده کنید.

### ۵. Typography Hierarchy
سلسله‌مراتب تایپوگرافی را رعایت کنید.

### ۶. Accessibility
- contrast ratio مناسب
- focus states واضح
- touch targets حداقل 44x44px

## 🎨 Color Palette Reference

### Primary (Emerald)
```
50:  #ecfdf5
100: #d1fae5
200: #a7f3d0
300: #6ee7b7
400: #34d399
500: #10b981 (main)
600: #059669
700: #047857
800: #065f46
900: #064e3b
```

### Warning (Amber)
```
500: #f59e0b (main)
```

### Error (Red)
```
500: #ef4444 (main)
```

### Info (Blue)
```
500: #3b82f6 (main)
```

## 📚 Resources

- [Design Tokens File](./src/design-tokens.css)
- [Main CSS File](./src/index.css)
- [Components](./src/components/)

## 🔄 Migration Guide

اگر از کد قدیمی استفاده می‌کنید:

### Before
```tsx
className="bg-emerald-500 text-white rounded-2xl shadow-lg"
```

### After
```tsx
className="bg-primary-500 text-white rounded-2xl shadow-lg"
```

یا از component classes استفاده کنید:
```tsx
className="btn-primary"
```

---

**نسخه**: 1.0.0  
**آخرین به‌روزرسانی**: 2024
