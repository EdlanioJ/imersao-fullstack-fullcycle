import { useContext } from 'react';
import BankContext from '../../context/BankContext';
import styles from './BankAccountBalance.module.scss';

interface BankAccountBalanceProps {
  balance: number;
}
const BankAccountBalance: React.FC<BankAccountBalanceProps> = ({ balance }) => {
  const bank = useContext(BankContext);
  return (
    <div className={`${styles.root} ${styles[bank.cssCode]}`}>
      <h2>
        Saldo em conta Corrente{' '}
        <span>AKZ {balance.toLocaleString('pt-BR')}</span>
      </h2>
    </div>
  );
};

export default BankAccountBalance;
