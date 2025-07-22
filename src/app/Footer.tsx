import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full flex gap-[24px] flex-wrap items-center justify-center py-4 bg-transparent">
      <a
        className="flex items-center gap-2 text-[12px]"
        href="https://iamshah.blog"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="/globe.svg"
          alt="Globe icon"
          width={16}
          height={16}
        />
        iamshah.blog
      </a>
    </footer>
  );
}
