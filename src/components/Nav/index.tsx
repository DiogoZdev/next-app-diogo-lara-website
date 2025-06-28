'use client'
import Link from "next/link";

interface Props {
  pages: Array<{
    page: string;
    path: string;
}>;
}

export const Nav = ({ pages }: Props) => {
  return (
    <nav className="w-full max-w-[1000px] mx-auto">
      <ul className="flex p-4 gap-8">
        {pages.map(({ page, path }) => (
          <Link key={page} href={path}>
            <li className="transition-colors hover:text-[var(--accent)]">{page}</li>
          </Link>
        ))}
      </ul>
    </nav>
  );
};
