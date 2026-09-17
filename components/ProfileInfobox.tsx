import Image from "next/image";
import styles from "./ProfileInfobox.module.css";
import type { WikiProfile } from "@/lib/wiki";

const icons: Record<string, string> = {
  Instagram: "/instagram.png",
  "Naver Blog": "/naver-blog.png",
  Tumblr: "/tumblr.png",
};

export default function ProfileInfobox({ profile }: { profile: WikiProfile }) {
  return (
    <aside className={styles.card} aria-label={`${profile.name} 프로필`}>
      <div className={styles.identity}><strong>{profile.name}</strong>{profile.subtitle && <span>{profile.subtitle}</span>}</div>
      <div className={styles.visual}>
        <Image className={styles.photo} src={profile.image} alt={`${profile.name} 프로필 이미지`} width={1254} height={1254} sizes="(max-width: 760px) 100vw, 320px" priority />
      </div>
      <dl className={styles.fields}>
        {profile.fields.map((field) => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}
      </dl>
      <div className={styles.links}>
        {profile.links.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
            <span className={styles.linkName}><Image src={icons[link.label]} alt="" width={20} height={20} />{link.label}</span>
            <small>{link.text}</small>
          </a>
        ))}
      </div>
    </aside>
  );
}
