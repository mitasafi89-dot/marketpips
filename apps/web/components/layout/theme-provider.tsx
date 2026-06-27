// theme-provider.tsx — lightweight, no next-themes dep needed
// Dark mode is set via 'dark' class on <html> in layout.tsx
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
