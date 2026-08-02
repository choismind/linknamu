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
        className="size-28 rounded-full object-cover ring-2 ring-black/10 dark:ring-white/15"
      />
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">{name}</h1>
      <p className="mt-1.5 text-sm text-black/60 dark:text-white/60">
        {tagline}
      </p>
    </header>
  );
}
