import ProfileHeader from "@/components/ProfileHeader";
import LinkList from "@/components/LinkList";
import { profile } from "@/config/profile";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-14 sm:py-20">
      <ProfileHeader
        name={profile.name}
        tagline={profile.tagline}
        avatar={profile.avatar}
      />
      <div className="mt-10">
        <LinkList links={profile.links} />
      </div>
      <footer className="mt-12 text-center text-xs text-black/35 dark:text-white/35">
        링크나무
      </footer>
    </main>
  );
}
