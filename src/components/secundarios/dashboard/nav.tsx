import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPendientes = searchParams.get("pendientes") !== null;

  return (
    <nav className="py-4">
      <ul className="flex gap-4 items-center">
        <li>
          <Link href="/dashboard">
            <span
              className={`${pathname === "/dashboard" && !isPendientes
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
      </ul>
    </nav>
  );
}
