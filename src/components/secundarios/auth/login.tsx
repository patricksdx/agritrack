"use client";

// import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { login } from "@/services/api/user";
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
import { FcGoogle } from "react-icons/fc";
import { pb } from "@/services/pocketbase";

const loginSchema = z.object({
  mail: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mail: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data.password, data.mail);
      if (response) {
        toast.success("Inicio de sesión exitoso");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error de autenticación:", error);
      toast.error("Error al iniciar sesión");
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
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="mail"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="mail">Correo electrónico</Label>
                    <FormControl>
                      <Input
                        id="mail"
                        type="mail"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">Contraseña</Label>
                    <FormControl>
                      <Input id="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="mt-5 flex flex-col gap-2">
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Cargando..." : "Iniciar Sesión"}
              </Button>
              <Button
                type="button"
                onClick={async () => { await pb.collection('users').authWithOAuth2({ provider: 'google' }) }}
                className="w-full"
                variant="outline">
                <FcGoogle />Iniciar con google
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <div className="flex gap-1 mt-5">
        <p>No tienes una cuenta?</p>
        <Link href={"/?register"} className="text-primary font-semibold">
          Registrate
        </Link>
      </div>
    </div>
  );
}
