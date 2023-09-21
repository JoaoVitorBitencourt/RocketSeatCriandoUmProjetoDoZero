import { useRouter } from 'next/router';
import styles from './header.module.scss';

const Header = () => {
  const router = useRouter();
  const handlerHome = () => {
    router.push('/');
  }
  return (
    <header className={styles.Header}>
      <div >
        <img
          src="/Logo.svg"
          alt="logo"
          onClick={handlerHome}
          className={styles.image}
        />
      </div>
    </header>
  )
}

export default Header;
