import styles from './Main.module.scss';

const Main: React.FC = ({ children }) => {
  return (
    <main className={styles.root}>
      <div className="container">{children}</div>
    </main>
  );
};

export default Main;
