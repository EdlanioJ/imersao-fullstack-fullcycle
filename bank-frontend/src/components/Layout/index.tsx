import React from 'react';
import { BankAccount } from '../../model';
import Footer from '../Footer';
import Main from '../Main';
import Navbar from '../Navbar';
interface LayoutProps {
  bankAccount?: BankAccount;
}
const Layout: React.FC<LayoutProps> = ({ children, bankAccount }) => {
  return (
    <>
      <Navbar bankAccount={bankAccount} />
      <Main>{children}</Main>
      <Footer />
    </>
  );
};

export default Layout;
