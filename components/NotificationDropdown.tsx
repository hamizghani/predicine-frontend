"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const notifications = [
  { id: 1, message: "New order received", link: "/orders" },
  { id: 2, message: "Product stock running low", link: "/inventory" },
  { id: 3, message: "Analytics updated", link: "/analytics" },
];

export default function NotificationDropdown() {
  const [unreadCount, setUnreadCount] = useState(notifications.length);

  const handleNotificationClick = () => {
    setUnreadCount(0); // Mark all as read when dropdown is opened
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-2" onClick={handleNotificationClick}>
          <Bell className="w-6 h-6 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} asChild>
              <a href={notification.link} className="block w-full px-2 py-1">
                {notification.message}
              </a>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
