"use client";
import { ProfileForm } from "@/components/common/profile-form";
import { PasswordChangeForm } from "@/components/common/password-change-form";
import { Button } from "@/components/ui/button";
import { logUserActivity } from "@/lib/logActivity";
import { signOut, useSession } from "next-auth/react";
import { UserActionType } from "@/types/UserActionTypes";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

export default function ProfilePage() {
  const session = useSession();
  const user = session.data?.user;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (!user?.id) return; // Ensure user is authenticated

    try {
      // Log user logout activity
      await logUserActivity(user.id, UserActionType.LOGOUT, {
        userAgent: navigator.userAgent, // Capture user agent from browser
      });

      // Proceed with sign-out
      await signOut({ redirect: false });
      router.push("/"); // Redirect to homepage after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/user/delete");
      if (response.status === 200) {
        toast.success("Account deleted successfully");
        signOut();
      }
    } catch (error) {
      console.error("Error deleting user", error);
      toast.error("Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center ">
      <div className="max-w-4xl py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="sm:px-0 px-5">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              View and manage your account details
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <ProfileForm />
          <PasswordChangeForm />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Delete Account
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Deleting your account is a permanent action. Once your account
                is deleted, all your data, including your profile, settings, and
                activity history, will be erased and cannot be recovered.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                This action is irreversible. Please proceed only if you are
                sure.
              </p>

              <Button onClick={handleDeleteAccount} variant="destructive">
                {isLoading ? "Deleting..." : "Permanently Delete Account"}
              </Button>
            </CardContent>
          </Card>

          <Button
            variant="destructive"
            className="sm:ml-6 ml-5"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
