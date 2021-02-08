import { useContext } from 'react';
import BankContext from '../../context/BankContext';
import { BankAccount } from '../../model';
import styles from './BankAccountCard.module.scss';

interface BankAccountCardProps {
  bankAccount: BankAccount;
}
const BankAccountCard: React.FC<BankAccountCardProps> = ({ bankAccount }) => {
  const bank = useContext(BankContext);
  return (
    <article className={`${styles.root} ${styles[bank.cssCode]}`}>
      <div>
        <h2 className={styles.ownerName}>{bankAccount.owner_name}</h2>
        <p className={`${styles.accountNumber} ${styles[bank.cssCode]}`}>
          {bankAccount.account_number}
        </p>
      </div>
      <span
        className={`fas fa-chevron-right ${styles.iconRight} ${
          styles[bank.cssCode]
        } `}
      />
    </article>
  );
};

export default BankAccountCard;
