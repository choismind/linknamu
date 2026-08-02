import LinkCard from "@/components/LinkCard";
import type { Link } from "@/config/profile";

export default function LinkList({ links }: { links: Link[] }) {
  return (
    <nav aria-label="링크 목록">
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.id}>
            <LinkCard link={link} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
