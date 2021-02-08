import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Button from '../../../../components/Button';
import Card from '../../../../components/Card';
import FormButtonActions from '../../../../components/FormButtonActions';
import Input from '../../../../components/Input';
import Layout from '../../../../components/Layout';
import PixKeyCard from '../../../../components/PixKeyCard';
import Title from '../../../../components/Title';
import { BankAccount, PixKey } from '../../../../model';
import { api } from '../../../../utils/http';
import Modal from '../../../../utils/modal';

import styles from './PixRegister.module.scss';

interface PixRegisterProps {
  pixKeys: PixKey[];
  bankAccount: BankAccount;
}
const PixRegister: NextPage<PixRegisterProps> = ({ bankAccount, pixKeys }) => {
  const {
    query: { id },
    push,
  } = useRouter();
  const { register, handleSubmit } = useForm();

  async function onSubmit(data) {
    try {
      await api.post(`bank-accounts/${id}/pix-keys`, data);
      Modal.fire({
        title: 'Chave cadastrada com sucesso',
        icon: 'success',
      });
      push(`/bank-accounts/${id}`);
    } catch (e) {
      console.error(e);
      Modal.fire({
        title: 'Ocorreu um erro. Verifique o console',
        icon: 'error',
      });
    }
  }
  return (
    <Layout bankAccount={bankAccount}>
      <div className="row">
        <div className="col-sm-6">
          <Title>Cadastrar chave pix</Title>
          <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
              <p className={styles.kindInfo}>Escolha um tipo de chave</p>
              <Input
                name="kind"
                type="radio"
                labelText="NIF"
                value="nif"
                ref={register}
              />

              <Input
                name="kind"
                type="radio"
                labelText="E-mail"
                value="email"
                ref={register}
              />

              <Input name="key" labelText="Digite a chave" ref={register} />

              <FormButtonActions>
                <Button type="submit">Cadastrar</Button>
                <Link href="/bank-accounts/[id]" as={`/bank-accounts/${id}`}>
                  <Button type="button" variant="info">
                    Voltar
                  </Button>
                </Link>
              </FormButtonActions>
            </form>
          </Card>
        </div>
        <div className="cal-sm-4 offset-md-2">
          <Title>Minhas chaves pix</Title>
          {pixKeys.map((pixKey) => (
            <PixKeyCard key={pixKey.id} pixKey={pixKey} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PixRegister;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { id },
  } = ctx;

  const [{ data: pixKeys }, { data: bankAccount }] = await Promise.all([
    await api.get(`bank-accounts/${id}/pix-keys`),
    await api.get(`bank-accounts/${id}`),
  ]);
  return {
    props: {
      pixKeys,
      bankAccount,
    },
  };
};
