import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Button from '../../../../../components/Button';
import Card from '../../../../../components/Card';
import FormButtonActions from '../../../../../components/FormButtonActions';
import Input from '../../../../../components/Input';
import Layout from '../../../../../components/Layout';
import Select from '../../../../../components/Select';
import Title from '../../../../../components/Title';
import { BankAccount } from '../../../../../model';
import { api } from '../../../../../utils/http';
import Modal from '../../../../../utils/modal';
interface TransactionRegisterProps {
  bankAccount: BankAccount;
}
const TransactionRegister: NextPage<TransactionRegisterProps> = ({
  bankAccount,
}) => {
  const { register, handleSubmit } = useForm();
  const {
    query: { id },
    push,
  } = useRouter();

  async function onSubmit(data) {
    try {
      await api.post(`bank-accounts/${id}/transactions`, {
        ...data,
        amount: new Number(data.amount),
      });
      Modal.fire({
        title: 'Transação realizada com sucesso',
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
      <Title>Realizar transferência</Title>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-sm-4">
              <Select labelText="Tipo" name="pix_key_kind" ref={register}>
                <option value="nif">NIF</option>
                <option value="email">E-mail</option>
              </Select>
            </div>
            <div className="col-sm-8">
              <Input name="pix_key_key" labelText="Chave" ref={register} />
            </div>
          </div>
          <Input
            name="amount"
            type="number"
            step=".01"
            labelText="Valor"
            ref={register}
            defaultValue="0.00"
          />
          <Input name="description" labelText="Descrição" ref={register} />
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
    </Layout>
  );
};

export default TransactionRegister;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { id },
  } = ctx;

  const { data: bankAccount } = await api.get(`bank-accounts/${id}`);

  return {
    props: {
      bankAccount,
    },
  };
};
