"use client";

// import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { registerUser } from "@/services/api/user";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const registerSchema = z.object({
  usuario_username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  usuario_nombres: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  usuario_apellidos: z
    .string()
    .min(2, "Los apellidos deben tener al menos 2 caracteres"),
  usuario_email: z.string().email("Correo electrónico inválido"),
  usuario_password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmar_password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
}).refine((data) => data.usuario_password === data.confirmar_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirmar_password"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      usuario_username: "",
      usuario_nombres: "",
      usuario_apellidos: "",
      usuario_email: "",
      usuario_password: "",
      confirmar_password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerUser(
        data.usuario_email,
        data.usuario_nombres,
        data.usuario_apellidos,
        data.usuario_password,
        data.usuario_password
      );
      console.log(response);

      if (response) {
        toast.success("Registro exitoso");
        router.push("/");
      }
    } catch (error) {
      console.error("Error de registro:", error);
      toast.error("Error al registrar usuario");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-1/2 h-32 pb-5">
        <Image
          src={"/logo.png"}
          alt="Logo"
          width={200}
          height={100}
          className="w-full h-full object-contain"
        />
      </div>
      <Card className="w-[90%]">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
          <CardDescription>
            Crea una cuenta para comenzar a usar AgriTrack
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="usuario_username"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="usuario_username">Nombre de usuario</Label>
                    <FormControl>
                      <Input
                        id="usuario_username"
                        placeholder="johndoe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usuario_nombres"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="usuario_nombres">Nombres</Label>
                    <FormControl>
                      <Input
                        id="usuario_nombres"
                        placeholder="John"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usuario_apellidos"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="usuario_apellidos">Apellidos</Label>
                    <FormControl>
                      <Input
                        id="usuario_apellidos"
                        placeholder="Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usuario_email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="usuario_email">Correo electrónico</Label>
                    <FormControl>
                      <Input
                        id="usuario_email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usuario_password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="usuario_password">Contraseña</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="usuario_password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmar_password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="confirmar_password">Confirmar contraseña</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="confirmar_password"
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="mt-5">
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrarse"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <div className="flex gap-1 mt-5">
        <p>¿Ya tienes una cuenta?</p>
        <Link href={"/"} className="text-primary font-semibold">
          Inicia sesión
        </Link>
      </div>
    </div>
  );
}
