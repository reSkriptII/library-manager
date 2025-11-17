import { ThemeProvider } from "./contexts/ThemeContext";
import { Router } from "./Router";

export default function App() {
  return (
    <ThemeProvider>
      {/* <UserProvider />*/}
      <Router />
    </ThemeProvider>
  );
}
