import { useContext } from 'react';
import BankContext from '../../context/BankContext';
import { PixKey } from '../../model';
import styles from './PixKeyCard.module.scss';

const pixKeyKinds = {
  nif: 'NIF',
  email: 'E-mail',
};

interface PixKeyCardProps {
  pixKey: PixKey;
}

const PixKeyCard: React.FC<PixKeyCardProps> = ({ pixKey }) => {
  const bank = useContext(BankContext);
  return (
    <div className={`${styles.root} ${styles[bank.cssCode]}`}>
      <p className={styles.kind}>{pixKeyKinds[pixKey.kind]}</p>
      <span className={styles.key}>{pixKey.key}</span>
    </div>
  );
};

export default PixKeyCard;
