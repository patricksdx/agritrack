"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaAngleLeft } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { pb } from "@/services/pocketbase";
import { User } from "@/services/interfaz/user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Header() {
  const pathname = usePathname();
  const user = pb.authStore.record;
  const [open, setOpen] = useState(false);
  const router = useRouter();

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

  const generarConsejos = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma3:12b',
          prompt: 'Dame 5 consejos para cuidar una planta en un departamento',
          stream: false
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error:", res.status, errorText);
        return;
      }

      const data = await res.json();
      console.log("Respuesta de Ollama:", data);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }, []);


  useEffect(() => {
    generarConsejos();
  }, []);

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <div onClick={handleBack} className="cursor-pointer">
          <FaAngleLeft size={24} />
        </div>
        <div className="flex items-center gap-4">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={pb.files.getURL(user as User, user?.avatar)} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-5 mt-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button onClick={() => {
                    pb.authStore.clear();
                    router.push("/");
                  }} variant="ghost" className="p-0 m-0 h-5 text-red-500">Logout</Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div >

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
