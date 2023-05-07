import { NextLayout } from "@/types/app-dir";
import "./globals.css";

export const metadata = {
  title: "Skylight AI ✨ Powered Application (SSR)",
  icons: {
    icon: [{ url: "/logo.svg" }, new URL("/logo.svg", "https://app.skylightai.io")],
  },
};

const RootLayout: NextLayout = ({ children }) => {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
