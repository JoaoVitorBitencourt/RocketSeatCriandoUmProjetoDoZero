import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { FaCalendar, FaUser } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({
  post
}: PostProps) {
  const router = useRouter()

  if (router.isFallback) {
      return <div>Carregando...</div>
  }
  const date = new Date(post.first_publication_date).getTime();

  const totalWords = post.data.content.map(el => {
    return el.body.map(el2 => {
        return el2.text.split(' ').length;
    });
  }).map(el => {
    return el.reduce((total, content) => {
        return total += content;
    })
  });

  const readTime = Math.ceil(totalWords.reduce((total, content) => {
    return total += content;
  }) / 200);

  return (
    <div className={styles.container}>
      <img src={post.data.banner.url} alt="banner" className={styles.Image}/>
      <div className={styles.postContent}>
        <h1 className={styles.title}>{post.data.title}</h1>
        <div className={styles.postInfo}>
          <div className={styles.containerInfo}>
            <FaCalendar className={styles.icon}/>
            <span>
            {
                format(date, "dd MMM yyyy", {
                  locale: ptBR
                })
            }
            </span>
          </div>
          <div className={styles.containerInfo}>
            <FaUser className={styles.icon}/>
            <span>{post.data.author}</span>
          </div>
          <div className={styles.containerInfo}>
            <MdOutlineWatchLater />
            <span>{readTime} min</span>
          </div>
        </div>
        <div>
          {post.data.content.map((content, index) => (
            <div key={index}>
              <h2 className={styles.titleContent}>{content.heading}</h2>
              <div>
                {content.body.map((body, index) => (
                  <p className={styles.text} key={index}>{body.text}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType("publication", {
    fetch: ["publication.uid"],
    pageSize: 100,
  });

  return {
    paths: posts.results.map((post) => {
      return {
        params: {
          slug: post.uid,
        },
      };
    }),
    fallback: true,
  }
};

export const getStaticProps = async ({params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID("publication", String(params.slug), {}); // alterar para post depois

  return {
    props: {
      post: response,
    },
  }
};
