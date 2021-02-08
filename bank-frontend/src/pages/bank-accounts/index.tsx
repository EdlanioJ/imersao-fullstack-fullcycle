import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

import BankAccountCard from '../../components/BankAccountCard';
import Layout from '../../components/Layout';
import Title from '../../components/Title';
import { BankAccount } from '../../model';
import { api } from '../../utils/http';

interface BankAccountListProps {
  bankAccounts: BankAccount[];
}
const BankAccountList: NextPage<BankAccountListProps> = ({ bankAccounts }) => {
  return (
    <Layout>
      <Title>Contas bancarias</Title>
      <div className="row">
        {bankAccounts.map((bankAcount) => (
          <Link
            key={bankAcount.id}
            href="/bank-account/[id]"
            as={`/bank-account/${bankAcount.id}`}
          >
            <a href="" className="col-12 col-md-6 col-md-4">
              <BankAccountCard bankAccount={bankAcount} />
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default BankAccountList;

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: bankAccounts } = await api.get('bank-accounts');
  return {
    props: {
      bankAccounts,
    },
  };
};
