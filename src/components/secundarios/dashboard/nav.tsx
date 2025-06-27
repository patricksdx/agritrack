import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPendientes = searchParams.get("pendientes") !== null;
<<<<<<< HEAD
=======
  const isObservaciones = searchParams.get("observaciones") !== null;
>>>>>>> a74149b (first commit)

  return (
    <nav className="py-4">
      <ul className="flex gap-4 items-center">
        <li>
          <Link href="/dashboard">
            <span
<<<<<<< HEAD
              className={`${pathname === "/dashboard" && !isPendientes
=======
              className={`${pathname === "/dashboard" && !isPendientes && !isObservaciones
>>>>>>> a74149b (first commit)
                  ? "font-semibold"
                  : "font-normal"
                }`}
            >
              Mis Plantas
            </span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/pendientes">
            <span
              className={`${isPendientes ? "font-semibold" : "font-normal"}`}
            >
              Pendientes
            </span>
          </Link>
        </li>
<<<<<<< HEAD
=======
        <li>
          <Link href="/dashboard/observaciones">
            <span
              className={`${isObservaciones ? "font-semibold" : "font-normal"}`}
            >
              Observaciones
            </span>
          </Link>
        </li>
>>>>>>> a74149b (first commit)
      </ul>
    </nav>
  );
}
