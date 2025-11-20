import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./features/users/contexts";
import { Router } from "./Router";

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router />
      </UserProvider>
    </ThemeProvider>
  );
}
