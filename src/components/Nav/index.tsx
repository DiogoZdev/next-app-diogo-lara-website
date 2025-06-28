import Link from "next/link";

interface PageInfo {
  page: string;
  path: string;
}

export interface NavProps {
  pages: PageInfo[];
}

export const Nav = ({ pages }: NavProps) => {
  return (
    <>
      <style jsx>{`
        ul {
          display: flex;
          flex-direction: row;
          padding: 1rem;
          gap: 2rem;
        }

        li {
          transition: color 0.2s ease-in-out;
        }

        li:hover {
          color: var(--accent);
        }
      `}</style>
      <nav>
        <ul>
          {pages.map(({ page, path }) => (
            <Link key={page} href={path}>
              <li>{page}</li>
            </Link>
          ))}
        </ul>
      </nav>
    </>
  );
};
