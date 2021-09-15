import {
  Column,
  IntegratedFiltering,
  IntegratedPaging,
  PagingState,
  SearchState,
  SortingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  PagingPanel,
  SearchPanel,
  Table,
  TableHeaderRow,
  Toolbar,
} from '@devexpress/dx-react-grid-material-ui';
import { Container, Typography, Button } from '@material-ui/core';
import { CreateOutlined } from '@material-ui/icons';
import { format, parseISO } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Transaction } from '../../model/Transaction';
import { Token, validateAuth } from '../../utils/auth';
import makeHttp from '../../utils/http';
import Head from 'next/head';

interface TransactionsPageProps {
  transactions: Transaction[];
}

const columns: Column[] = [
  {
    name: 'payment_date',
    title: 'Data pag.',
    getCellValue: (row: any, columnName: string) => {
      return format(parseISO(row[columnName].slice(0, 10)), 'dd/MM/yyyy');
    },
  },
  {
    name: 'name',
    title: 'Nome',
  },
  {
    name: 'category',
    title: 'Categoria',
  },
  {
    name: 'type',
    title: 'Operação',
  },
  {
    name: 'created_at',
    title: 'Criado em',
    getCellValue: (row: any, columnName: string) => {
      return format(parseISO(row[columnName].slice(0, 10)), 'dd/MM/yyyy');
    },
  },
];

const TransactionsPage: NextPage<TransactionsPageProps> = (props) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Transactions | TransFlow</title>
      </Head>
      <Container>
        <Typography component="h1" variant="h4">
          Minhas transacoes
        </Typography>
        <Button
          startIcon={<CreateOutlined />}
          variant={'contained'}
          color="primary"
          onClick={() => router.push('/transactions/new')}
        >
          Criar
        </Button>

        <Grid rows={props.transactions} columns={columns}>
          <Table />
          <SearchState />
          <PagingState />
          <SortingState
            defaultSorting={[{ columnName: 'created_at', direction: 'desc' }]}
          />
          <TableHeaderRow showSortingControls />
          <IntegratedFiltering />
          <Toolbar />
          <SearchPanel />
          <PagingPanel />
          <IntegratedPaging />
        </Grid>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = validateAuth(ctx.req);

  if (!auth) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  const token = (auth as Token).token;

  const { data: transactions } = await makeHttp(token).get('/transactions');

  return {
    props: {
      transactions,
    },
  };
};

export default TransactionsPage;
