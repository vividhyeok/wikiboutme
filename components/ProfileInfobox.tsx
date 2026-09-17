import Image from "next/image";
import styles from "./ProfileInfobox.module.css";
import type { WikiProfile } from "@/lib/wiki";

export default function ProfileInfobox({ profile }: { profile: WikiProfile }) {
  return (
    <aside className={styles.card} aria-label={`${profile.name} 프로필`}>
      <div className={styles.visual}>
        {profile.image ? (
          <Image
            className={styles.photo}
            src={profile.image}
            alt={`${profile.name} 프로필 이미지`}
            width={800}
            height={600}
            sizes="(max-width: 760px) 100vw, 340px"
            priority
          />
        ) : (
          <div className={styles.placeholder} aria-label="프로필 사진 미등록">
            <span>NO IMAGE</span>
          </div>
        )}
      </div>

      <div className={styles.identity}>
        <strong>{profile.name}</strong>
        {profile.subtitle && <span>{profile.subtitle}</span>}
      </div>

      {profile.fields.length > 0 && (
        <dl className={styles.fields}>
          {profile.fields.map((field) => (
            <div key={`${field.label}-${field.value}`}>
              <dt>{field.label}</dt>
              <dd>{field.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {profile.links.length > 0 && (
        <div className={styles.links}>
          {profile.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              <span>{link.label}</span>
              <small>{link.text}</small>
            </a>
          ))}
        </div>
      )}
    </aside>
  );
}
