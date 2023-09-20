import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link';
import Post from '../components/Post';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  postsPagination
} : HomeProps) {
  return (
    <div className={styles.body}>
      {
      postsPagination.results.map(post => (
        <Post
          data={post.data}
          first_publication_date={post.first_publication_date}
          key={post.uid}
          uid={post.uid}
        />
      ))
      }
      {
        postsPagination.next_page !== null
        &&
        <button
          type="button"
        >
            Carregar mais posts
        </button>
      }
    </div>
  );
}

export const getStaticProps = async ({req}) => {
  const prismic = getPrismicClient({
    req
  });
  const postsResponse = await prismic.getByType('publication', { // alterar para post depois

  });

  // TODO
  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: postsResponse.results,
      }
    },
  }
};
