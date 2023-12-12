import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";


export default function Logo({ className }: any) {
  return (
    <Link href={`/`} className="flex items-center gap-4 py-2">
      <Image
        src="/images/logo.png"
        alt="logo"
        width={40}
        height={40}
        className={clsx([className])}
      />
    </Link>
  );
}
