import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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

  return (
    <div className={styles.container}>
      <div className={styles.postContent}>
        <img src={post.data.banner.url} alt="banner" className={styles.Image}/>
        <h1 className={styles.title}>{post.data.title}</h1>
        <div className={styles.postInfo}>
          <span>{post.first_publication_date}</span>
          <span>{post.data.author}</span>
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
