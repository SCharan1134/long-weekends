"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, Clipboard, HelpCircle } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function UserNav() {
  const session = useSession();
  const user = session.data?.user;
  const isAdmin = user?.role === "admin";
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const router = useRouter();

  const getFallbackInitials = (name: string | null | undefined): string => {
    if (!name) return "U"; // Default fallback if name is not provided

    const words = name.split(" "); // Split the name into words
    const initials =
      words.length > 1
        ? words
            .slice(0, 2)
            .map((word) => word.charAt(0).toUpperCase())
            .join("") // Get first two initials
        : name.charAt(0).toUpperCase(); // Get first initial if only one word

    return initials.length === 1 ? initials + initials : initials; // Ensure two characters
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/"); // Redirect to homepage after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Usage example
  const initials = getFallbackInitials(user?.name);
  return (
    <>
      {isLanding ? (
        <Button
          asChild
          className="hidden md:inline-flex bg-blue-600 text-white hover:bg-blue-700"
        >
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image ?? ""} alt={user?.name ?? ""} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin ? (
              <DropdownMenuGroup>
                <Link href={"/super-admin/dashboard"}>
                  <DropdownMenuItem>
                    <Clipboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                </Link>
                <Link href={"/super-admin/holidays"}>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" /> Holidays
                  </DropdownMenuItem>
                </Link>
                <Link href={"/super-admin/feedback"}>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" /> Feedback
                  </DropdownMenuItem>
                </Link>
                <Link href={"/super-admin/profile"}>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            ) : (
              <DropdownMenuGroup>
                <Link href={"/dashboard"}>
                  <DropdownMenuItem>
                    {" "}
                    <Clipboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                </Link>
                <Link href={"/holidays"}>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" /> Holidays
                  </DropdownMenuItem>
                </Link>
                {/* <Link href={"/leaves"}>
                  <DropdownMenuItem>
                    {" "}
                    <User className="mr-2 h-4 w-4" />
                    Leaves
                  </DropdownMenuItem>
                </Link> */}
                <Link href={"/profile"}>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link href={"/landing/contact-us"}>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Feedback
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
