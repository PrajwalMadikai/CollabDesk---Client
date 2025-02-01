"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { DollarSign, Home, LogOut, Plus, Users } from "lucide-react";

const user = {
  name: "Admin User",
  email: "admin@example.com",
  avatar: "/path/to/avatar.jpg",
};

const Logout=async()=>{
  try {


    
  } catch (error) {
    console.log(error);
    
  }
}

const items = [
  { title: "Home", key: "home", icon: Home },
  { title: "Users", key: "users", icon: Users },
  { title: "Payments", key: "payments", icon: DollarSign },
  { title: "Add Payment", key: "add-payment", icon: Plus },
];

const AppSidebar = ({ onSelectMenu }: { onSelectMenu: (key: string) => void }) => {
  return (
    <Sidebar className="h-screen w-[250px] bg-black text-white shadow-xl rounded-r-3xl flex flex-col items-center">
      <div className="text-lg  text-white text-center mt-6 uppercase tracking-tight">
        Admin Dashboard
      </div>

      <SidebarContent className="flex-1 flex flex-col justify-center w-full">
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col items-center gap-6 mt-8 w-full">
            <SidebarMenu className="w-full">
              {items.map((item) => (
                <SidebarMenuItem key={item.key} className="w-full">
                  <SidebarMenuButton
                    asChild
                    onClick={() => onSelectMenu(item.key)}
                    className="flex flex-col items-center w-full h-14 p-4 border border-gray-600 rounded-[2px] bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200"
                  >
                    <button className="flex flex-col items-center space-y-2 w-full">
                      <span className="text-md font-bold">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 🔹 User Section at the Bottom */}
      <div className="p-6 border-t border-gray-700 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center justify-center space-x-3 p-3">
              <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full border" />
              <span className="text-md font-medium">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700">
            <DropdownMenuLabel className="text-white">{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-white hover:bg-gray-700">Subscription</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 hover:bg-gray-700">
              <LogOut className="mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
