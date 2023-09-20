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
  // TODO

  return (
    <div>
      <img src="/Logo.svg" alt="logo" />
      {post.data.title}
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

  // TODO
};

export const getStaticProps = async ({params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID("publication", String(params.slug), {});

  return {
    props: {
      post: response,
    },
  }

  // TODO
};
