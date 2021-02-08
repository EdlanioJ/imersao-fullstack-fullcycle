import { format, parseISO } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';
import Link, { LinkProps } from 'next/link';
import { useContext } from 'react';
import BankAccountBalance from '../../../components/BankAccountBalance';
import Layout from '../../../components/Layout';
import Title from '../../../components/Title';
import BankContext from '../../../context/BankContext';
import { BankAccount, Transaction } from '../../../model';
import { api } from '../../../utils/http';
import styles from './BankAccountDashboard.module.scss';

interface ActionLinkProps extends LinkProps {}

const ActionLink: React.FC<ActionLinkProps> = ({ children, ...rest }) => {
  const bank = useContext(BankContext);
  return (
    <Link {...rest}>
      <a className={`${styles.actionLink} ${styles[bank.cssCode]}`}>
        {children}
      </a>
    </Link>
  );
};

interface HeaderProps {
  bankAccount: BankAccount;
}
const Header: React.FC<HeaderProps> = ({ bankAccount }) => {
  return (
    <div className={`container ${styles.header}`}>
      <BankAccountBalance balance={bankAccount.balance} />
      <div className={styles.buttonActions}>
        <ActionLink
          href="/bank-accounts/[id]/pix/transactions/register"
          as={`/bank-accounts/${bankAccount.id}/pix/transactions/register`}
        >
          Realizar transferência
        </ActionLink>
        <ActionLink
          href={'/bank-accounts/[id]/pix/register'}
          as={`/bank-accounts/${bankAccount.id}/pix/register`}
        >
          Cadastrar chave pix
        </ActionLink>
      </div>
    </div>
  );
};

interface BankAccountDashboardProps {
  bankAccount: BankAccount;
  transactions: Transaction[];
}

const BankAccountDashboard: NextPage<BankAccountDashboardProps> = ({
  bankAccount,
  transactions,
}) => {
  return (
    <Layout>
      <Header bankAccount={bankAccount} />
      <div>
        <h1 className={styles.titleTable}>Últimos lançamentos</h1>
        <table
          className={`table table-borderless table-striped ${styles.tableTransactions}`}
        >
          <thead>
            <tr>
              <th scope="col">Data</th>
              <th scope="col" colSpan={3}>
                Descrição
              </th>
              <th scope="col" className="text-right">
                Valor (AKZ)
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{format(parseISO(transaction.created_at), 'dd/MM')}</td>
                <td colSpan={3}>{transaction.description}</td>
                <td className="text-right">
                  {transaction.amount.toLocaleString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default BankAccountDashboard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { id },
  } = ctx;

  const [{ data: bankAccount }, { data: transactions }] = await Promise.all([
    await api.get(`/bank-accounts/${id}`),
    await api.get(`/bank-accounts/${id}/transactions`),
  ]);
  return {
    props: {
      bankAccount,
      transactions,
    },
  };
};
