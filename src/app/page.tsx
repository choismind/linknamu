import ProfileHeader from "@/components/ProfileHeader";
import LinkList from "@/components/LinkList";
import { profile } from "@/config/profile";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[26rem] flex-1 flex-col px-7 py-16 sm:px-8 sm:py-24">
      <ProfileHeader
        name={profile.name}
        tagline={profile.tagline}
        avatar={profile.avatar}
      />
      <div className="mt-12">
        <LinkList links={profile.links} />
      </div>
      <footer className="mt-16 text-center text-xs tracking-wide text-white/35">
        링크나무
      </footer>
    </main>
  );
}
