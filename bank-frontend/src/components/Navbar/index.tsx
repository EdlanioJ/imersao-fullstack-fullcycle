import Link from 'next/link';
import { useContext } from 'react';
import BankContext from '../../context/BankContext';
import { BankAccount } from '../../model';
import styles from './Navbar.module.scss';

interface NavbarProps {
  bankAccount?: BankAccount;
}
const Navbar: React.FC<NavbarProps> = ({ bankAccount }) => {
  const bank = useContext(BankContext);
  return (
    <nav
      className={`navbar navbar-expand-lg ${styles.root} ${
        styles[bank.cssCode]
      }`}
    >
      <div className={`container-fluid ${styles.navbarBody}`}>
        <Link href="/bank-accounts" as="/bank-accounts">
          <a className={`navbar-brand ${styles.navbarBrand}`}>
            <img
              src="/img/icon_banco.png"
              alt="Bank"
              className={styles.logoBank}
            />
            <div className={styles.bankName}>
              <span>Cod -{bank.code}</span>
              <h2>{bank.name}</h2>
            </div>
          </a>
        </Link>
        {bankAccount && (
          <div
            className={`collapse navbar-collapse ${styles.navbarRightRoot}`}
            id="navbarSupportedContent"
          >
            <ul className={`navbar-nav ml-auto ${styles.navbarRightBody}`}>
              <li className={`nav-item ${styles.bankAccountInfo}`}>
                <img
                  src="/img/icon_user.png"
                  alt="Bank"
                  className={styles.iconUser}
                />
                <p className={styles.ownerName}>
                  {bankAccount.owner_name} | C/C: {bankAccount.account_number}
                </p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
