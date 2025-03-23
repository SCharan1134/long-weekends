import type { Metadata } from "next";
import { ProfileForm } from "@/components/common/profile-form";
import { PasswordChangeForm } from "@/components/common/password-change-form";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your profile details",
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center">
      <div className="container max-w-4xl py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              View and manage your account details
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <ProfileForm />
          <PasswordChangeForm />
        </div>
      </div>
    </div>
  );
}
