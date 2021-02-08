import styles from './FormButtonActions.module.scss';

const FormButtonActions: React.FC = ({ children }) => {
  return <div className={styles.root}>{children}</div>;
};

export default FormButtonActions;
