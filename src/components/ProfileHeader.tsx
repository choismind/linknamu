import Image from "next/image";

type ProfileHeaderProps = {
  name: string;
  tagline: string;
  avatar: string;
};

export default function ProfileHeader({
  name,
  tagline,
  avatar,
}: ProfileHeaderProps) {
  return (
    <header className="flex flex-col items-center text-center">
      <Image
        src={avatar}
        alt={`${name} 프로필 사진`}
        width={112}
        height={112}
        priority
        // placehold.co는 SVG로 응답하므로 최적화를 건너뛴다
        unoptimized
        className="size-28 rounded-full object-cover shadow-[0_18px_50px_-18px_rgba(56,189,248,0.65)] ring-1 ring-white/25"
      />
      <h1 className="mt-6 text-[1.7rem] leading-tight font-bold tracking-tight text-white">
        {name}
      </h1>
      <p className="mt-2 text-sm text-white/60">{tagline}</p>
    </header>
  );
}
