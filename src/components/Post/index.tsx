import Link from "next/link";
import styles from "./post.module.scss";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { FaCalendar, FaUser } from "react-icons/fa";

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}
export default function Post({
  data,
  first_publication_date,
  uid
}: Post) {
  const date = new Date(first_publication_date).getTime();

  return (
    <Link href={`/post/${uid}`} className={styles.container}>
      <h1 className={styles.title}>{data.title}</h1>
      <p className={styles.subtitle}>{data.subtitle}</p>
      <div className={styles.info}>
        <div className={styles.createdAt}>
          <FaCalendar className={styles.icon}/>
          <time>
            {
              format(date, "dd MMM yyyy", {
                locale: ptBR
              })
            }
          </time>
        </div>

        <div className={styles.user}>
          <FaUser className={styles.icon}/>
          <span>{data.author}</span>
        </div>
      </div>
    </Link>
  );
}
