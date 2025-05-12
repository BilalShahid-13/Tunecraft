import { Loader2 } from "lucide-react";

export function GetServerLoading({session}) {
  if (!session) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h3 className="text-[#ff7e6e] uppercase font-inter text-4xl flex items-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          Tunecraft
        </h3>
      </div>
    );
  }
  return null
}
