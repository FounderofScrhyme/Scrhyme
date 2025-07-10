import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { syncUserToSupabase } from "./actions/user.action";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Scrhyme",
  description: "The simplest way to be a hiphop artist.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await syncUserToSupabase();
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-slate-950 text-slate-50">
          <div className="min-h-screen">
            <Navbar />
            <main className="py-8">
              {/* container to center the content */}
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="hidden lg:block lg:col-span-3">
                    <Sidebar />
                  </div>
                  <div className="lg:col-span-9">{children}</div>
                </div>
              </div>
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
