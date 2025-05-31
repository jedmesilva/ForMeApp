
import { Menu, Bell } from "lucide-react";

interface TopHeaderProps {
  title: string;
  subtitle?: string;
}

export function TopHeader({ title, subtitle }: TopHeaderProps) {
  return (
    <>
      {/* Navbar Superior */}
      <div className="flex items-center justify-between mb-2">
        <button className="p-2 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 transition-all">
          <Menu className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-xl font-bold">{title}</h1>
        <button className="p-2 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 transition-all relative">
          <Bell className="w-6 h-6 text-white" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">3</span>
          </div>
        </button>
      </div>
      
      {/* Saudação */}
      {subtitle && (
        <div className="mb-2">
          <p className="text-blue-100 text-sm">{subtitle}</p>
        </div>
      )}
    </>
  );
}
