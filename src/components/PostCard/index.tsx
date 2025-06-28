'use client'
import Link from "next/link";

interface PostCardProps {
  title: string;
  date: string;
  language: string;
  preview: string;
  url: string;
}

export const PostCard = ({
  date,
  language,
  title,
  preview,
  url,
}: PostCardProps) => {
  const dateSplit = date.includes("/") ? date.split("/") : date.split("-");
  const dateOrdered =
    Number.parseInt(dateSplit[0], 10) > Number.parseInt(dateSplit[2], 10)
      ? dateSplit.reverse()
      : dateSplit;

  return (
    <>
      <style jsx>{`
        .post-card {
          margin-top: 2rem;
          padding: 1rem;
          display: flex;
          gap: 1rem;
        }

        .post-card:hover {
          background: var(--gradient-bg-transparent);
        }

        .date {
          display: flex;
          flex-direction: column;
          color: var(--accent);
        }

        .big-number {
          font-size: 2rem;
          line-height: 1;
        }

        .post-info {
          display: flex;
          flex-direction: column;
        }
      `}</style>

      <Link href={`/post/${url}`}>
        <div className="post-card">
          <div className="date">
            <span className="big-number">{dateOrdered[0]}</span>
            <span className="big-number">{dateOrdered[1]}</span>
            <span>{dateOrdered[2]}</span>
          </div>
          <div className="post-info">
            <span className="accent">{language}</span>
            <span className="bold">{title}</span>
            <p>{preview}</p>
          </div>
        </div>
      </Link>
    </>
  );
};
