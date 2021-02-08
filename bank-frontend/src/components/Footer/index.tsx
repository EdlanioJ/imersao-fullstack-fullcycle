import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={styles.root}>
      <img src="/img/logo_pix.png" alt="Code Pix" />
    </footer>
  );
};

export default Footer;
