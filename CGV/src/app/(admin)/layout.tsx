"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { authService } from "@/services/auth.service";
import { UserRole } from "@/types/auth.types";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and is admin
    const checkAuth = async () => {
      // const response = localStorage.getItem("isAdmin") === "true" ? true : false;
      // if (!response) {
      //   router.push("/auth/login");
      // }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-950">
      <Sidebar />
      <main className="ml-20 lg:ml-64 transition-all duration-300">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
