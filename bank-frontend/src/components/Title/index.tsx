import styles from './Title.module.scss';

const Title: React.FC = ({ children }) => {
  return <h1 className={styles.root}>{children}</h1>;
};

export default Title;
