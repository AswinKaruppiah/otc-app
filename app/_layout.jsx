import "../styles/global.css";
import { Slot } from "expo-router";

/**
 * Root layout — wraps the entire app.
 * Import global CSS here once so every route gets it.
 */
export default function RootLayout() {
  return <Slot />;
}
