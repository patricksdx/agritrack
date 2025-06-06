"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { App } from "@capacitor/app";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { FaAngleLeft } from "react-icons/fa6";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleBack = () => {
    if (pathname === "/dashboard") {
      setOpen(true);
    } else {
      window.history.back();
    }
  };

  const cerrarApp = async () => {
    await App.exitApp();
  };

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <div onClick={handleBack} className="cursor-pointer">
          <FaAngleLeft size={24} />
        </div>
        <div>
          <Search size={20} />
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Quieres cerrar la app?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={cerrarApp}>Cerrar app</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
