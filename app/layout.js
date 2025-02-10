import { Inter } from "next/font/google";
import Provider from "./_components/Provider";
import { Toaster } from "react-hot-toast";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Home Service app",
  description: "Find Home Service/Repair Near You",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Toaster position="top-right" />
          <div>{children}</div>
        </Provider>
      </body>
    </html>
  );
}
