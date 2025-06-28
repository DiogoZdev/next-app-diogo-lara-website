/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowRight, CalendarDots } from "@phosphor-icons/react";
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
  const iconsSize = 28;
  const dateSplit = date.includes("/") ? date.split("/") : date.split("-");
  const dateOrdered =
    Number.parseInt(dateSplit[0], 10) > Number.parseInt(dateSplit[2], 10)
      ? dateSplit.reverse()
      : dateSplit;

  const [day, month, year] = dateOrdered;

  function translateMonth(month: string) {
     const names: { [key: string]: string } = {
      "01": "Jan",
      "02": "Feb",
      "03": "Mar",
      "04": "Apr",
      "05": "May",
      "06": "Jun",
      "07": "Jul",
      "08": "Aug",
      "09": "Sep",
      "10": "Oct",
      "11": "Nov",
      "12": "Dec",
    };

    return names[month] || month;
  }

  return (
    <Link href={url} className="block group">
      <div
        id="card"
        className="relative flex flex-col md:flex-row border-solid border-[1px] border-gray-700 mb-12 rounded-lg transition-all duration-300 group-hover:border-orange-500 group-hover:-translate-y-[5px]"
      >
        <div className="flex flex-col items-center justify-center text-center p-4 min-w-[120px] border-b-2 md:border-b-0 md:border-r-2 border-gray-700 text-orange-400">
          <CalendarDots size={32} className="text-gray-400 mb-2" />
          <span className="text-[28px] font-bold leading-none">{day}</span>
          <span className="text-[24px]">{translateMonth(month)}</span>
          <span className="text-[16px] text-gray-400">{year}</span>
        </div>

        {/* Post Info Section */}
        <div className="w-full p-4 flex flex-col gap-2">
          <h2 className="text-xl font-bold">{title}</h2>

          <p className="text-gray-300">{preview}</p>

          <div className="flex justify-between items-center mt-4">
            <span className="p-2 bg-[#333] rounded text-sm cursor-default">{language}</span>

            <ArrowRight size={iconsSize} className="text-gray-500 transition-transform duration-300 group-hover:text-white group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};
