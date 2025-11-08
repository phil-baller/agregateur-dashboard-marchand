"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { RoleSwitcher } from "@/components/role-switcher";

export default function Home() {
  const { initializeDummyUser, currentRole } = useAuthStore();

  useEffect(() => {
    // Initialize with CLIENT role if no role is set
    if (!currentRole) {
      initializeDummyUser("CLIENT");
    }
  }, [currentRole, initializeDummyUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-6">
      <RoleSwitcher />
    </div>
  );
}
