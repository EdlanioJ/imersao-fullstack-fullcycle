import styles from './Card.module.scss';

const Card: React.FC = ({ children }) => {
  return <div className={styles.root}> {children}</div>;
};

export default Card;
