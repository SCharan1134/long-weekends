"use client";

import React, { useEffect } from "react";

import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronRight, Download, Moon, Sun } from "lucide-react";
import { UserActionType } from "@/types/UserActionTypes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface UserActivityLogs {
  id: string;
  userId: string;
  action: UserActionType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}

export default function UserLogsPage() {
  const params = useParams();
  const id = params.id as string;
  const [logs, setLogs] = useState<UserActivityLogs[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function exportLogs() {
    setIsExporting(true);
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;

    const exportFileDefaultName = `user-logs-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    setIsExporting(false);
  }

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/admin/logs/${id}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch logs");
        }
        const data = response.data;
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
        toast.error("Failed to fetch logs");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchLogs();
  }, [id]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Activity Logs</h1>
        <div className="flex gap-2">
          <Button
            disabled={isExporting}
            variant="outline"
            size="sm"
            onClick={exportLogs}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Logs</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="admin">Admin Actions</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="file">Files</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <TerminalLogs isloading={isLoading} logs={logs} />
        </TabsContent>
        <TabsContent value="auth" className="mt-4">
          <TerminalLogs
            isloading={isLoading}
            logs={logs.filter((log) =>
              [
                UserActionType.LOGIN,
                UserActionType.LOGOUT,
                UserActionType.FAILED_LOGIN_ATTEMPT,
                UserActionType.PASSWORD_RESET,
                UserActionType.ACCOUNT_ACTIVATED,
              ].includes(log.action as UserActionType)
            )}
          />
        </TabsContent>
        <TabsContent value="admin" className="mt-4">
          <TerminalLogs
            isloading={isLoading}
            logs={logs.filter((log) =>
              [UserActionType.ADMIN_CREATED_USER].includes(
                log.action as UserActionType
              )
            )}
          />
        </TabsContent>
        <TabsContent value="profile" className="mt-4">
          <TerminalLogs
            isloading={isLoading}
            logs={logs.filter((log) =>
              [UserActionType.PROFILE_UPDATED].includes(
                log.action as UserActionType
              )
            )}
          />
        </TabsContent>
        <TabsContent value="file" className="mt-4">
          <TerminalLogs
            isloading={isLoading}
            logs={logs.filter((log) =>
              [
                UserActionType.FILE_UPLOADED,
                UserActionType.FILE_DELETED,
              ].includes(log.action as UserActionType)
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TerminalLogs({
  logs,
  isloading,
}: {
  logs: UserActivityLogs[];
  isloading: boolean;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const bgColor = theme === "dark" ? "bg-black" : "bg-gray-100";
  const headerBgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-200";
  const borderColor = theme === "dark" ? "border-gray-800" : "border-gray-300";
  const textColor = theme === "dark" ? "text-gray-300" : "text-gray-800";

  return (
    <Card className={`${bgColor} ${borderColor} rounded-md overflow-hidden`}>
      <div
        className={`${headerBgColor} px-4 py-2 border-b ${borderColor} flex items-center justify-between`}
      >
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div
          className={`text-xs ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          user-activity-logs
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
      {isloading ? (
        <div className="p-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex gap-2 items-center my-4">
              <Skeleton className="w-1/4 h-3" />
              <Skeleton className="w-1/3 h-3" />
              <Skeleton className="w-1/4 h-3" />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`p-4 font-mono text-sm ${textColor} max-h-[600px] overflow-y-auto`}
        >
          {logs.map((log) => (
            <LogEntry key={log.id} log={log} theme={theme} />
          ))}
        </div>
      )}
    </Card>
  );
}

function LogEntry({
  log,
  theme,
}: {
  log: UserActivityLogs & { createdAt: Date };
  theme: "dark" | "light";
}) {
  const [expanded, setExpanded] = React.useState(false);

  const timestamp = new Date(log.createdAt).toISOString();
  const timeAgo = formatDistanceToNow(log.createdAt, { addSuffix: true });

  const getThemedActionColor = (action: UserActionType): string => {
    const actionGroups = {
      auth: [
        UserActionType.LOGIN,
        UserActionType.LOGOUT,
        UserActionType.FAILED_LOGIN_ATTEMPT,
        UserActionType.PASSWORD_UPDATED,
        UserActionType.PASSWORD_RESET,
        UserActionType.ACCOUNT_CREATED,
        UserActionType.ACCOUNT_DELETED,
        UserActionType.EMAIL_VERIFIED,
        UserActionType.OTP_SENT,
        UserActionType.OTP_VERIFIED,
        UserActionType.ACCOUNT_ACTIVATED,
        UserActionType.ACCOUNT_DEACTIVATED,
      ],
      profile: [
        UserActionType.PROFILE_UPDATED,
        UserActionType.USER_IMAGE_UPDATED,
      ],
      holiday: [
        UserActionType.HOLIDAY_ADDED,
        UserActionType.HOLIDAY_EDITED,
        UserActionType.HOLIDAY_DELETED,
        UserActionType.LONG_WEEKEND_CREATED,
        UserActionType.FETCH_HOLIDAYS,
      ],
      feedback: [
        UserActionType.FEEDBACK_SUBMITTED,
        UserActionType.FEEDBACK_MARKED_RESOLVED,
      ],
      file: [UserActionType.FILE_UPLOADED, UserActionType.FILE_DELETED],
      admin: [
        UserActionType.ADMIN_CREATED_USER,
        UserActionType.ADMIN_UPDATED_USER,
        UserActionType.ADMIN_TOGGLED_STATUS_USER,
        UserActionType.ADMIN_DELETED_USER,
        UserActionType.ADMIN_CHANGED_USER_ROLE,
      ],
    };

    if (actionGroups.auth.includes(action))
      return theme === "dark" ? "text-blue-400" : "text-blue-600";
    if (actionGroups.profile.includes(action))
      return theme === "dark" ? "text-green-400" : "text-green-600";
    if (actionGroups.holiday.includes(action))
      return theme === "dark" ? "text-purple-400" : "text-purple-600";
    if (actionGroups.feedback.includes(action))
      return theme === "dark" ? "text-yellow-400" : "text-yellow-600";
    if (actionGroups.file.includes(action))
      return theme === "dark" ? "text-orange-400" : "text-orange-600";
    if (actionGroups.admin.includes(action))
      return theme === "dark" ? "text-red-400" : "text-red-600";

    return theme === "dark" ? "text-gray-400" : "text-gray-600";
  };

  const timestampColor = theme === "dark" ? "text-gray-500" : "text-gray-600";
  const labelColor = theme === "dark" ? "text-gray-500" : "text-gray-600";
  const textColor = theme === "dark" ? "text-gray-400" : "text-gray-700";
  const nameColor = theme === "dark" ? "text-white" : "text-black";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const preColor = theme === "dark" ? "bg-gray-900" : "bg-gray-200";

  return (
    <div className="mb-4">
      <div className="flex items-start">
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 mr-2 focus:outline-none"
        >
          {expanded ? (
            <ChevronDown
              className={`h-3 w-3 ${
                theme === "dark" ? "text-gray-500" : "text-gray-600"
              }`}
            />
          ) : (
            <ChevronRight
              className={`h-3 w-3 ${
                theme === "dark" ? "text-gray-500" : "text-gray-600"
              }`}
            />
          )}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={timestampColor}>
              [{timestamp.split("T")[0]} {timestamp.split("T")[1].split(".")[0]}
              ]
            </span>
            <span
              className={`font-semibold ${getThemedActionColor(
                log.action as UserActionType
              )}`}
            >
              {log.action}
            </span>
            <span className={textColor}>by</span>
            <span className={nameColor}>{log.user.name}</span>
            <span className={`${timestampColor} text-xs`}>({timeAgo})</span>
          </div>

          {expanded && (
            <div className={`mt-2 ml-2 pl-2 border-l ${borderColor} space-y-1`}>
              <div className={textColor}>
                <span className={labelColor}>User ID:</span> {log.userId}
              </div>
              <div className={textColor}>
                <span className={labelColor}>Email:</span> {log.user.email}
              </div>

              {log.metadata && (
                <div className="mt-2">
                  <div className={labelColor}>Metadata:</div>
                  <pre
                    className={`${preColor} p-2 rounded mt-1 text-xs overflow-x-auto`}
                  >
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
