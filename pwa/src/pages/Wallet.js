import { head, get } from 'lodash';
import { useQuery } from 'react-query';
import { Typography } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import Page from '../components/Page';
import { fetchUserLedger } from '../actions/Wallet';
import ReusableTabs from '../components/reusables/Tabs';
import JuaWalletPaymentForm from '../sections/@dashboard/app/JuaWalletPaymentForm';


export default function Wallet() {
  const { data, isLoading } = useQuery(['user_ledger'], fetchUserLedger, {
    enabled: true,
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
  });

  const renderTransactionLedger = () => {
    const columns = [
      {
        name: 'ref',
        label: 'Reference code',
        options: {
          filter: false,
          showColumn: true,
          allowToggle: false,
          sort: false,
          display: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            const row = tableMeta.tableData[tableMeta.rowIndex];
            return (
              <Typography sx={{ fontSize: 10 }} align="Center" variant="p">
                {get(row, 'ref')}
              </Typography>
            );
          },
        },
      },
      {
        name: 'title_of_expense_or_revenue',
        label: 'Title',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            const row = tableMeta.tableData[tableMeta.rowIndex];
            return (
              <Typography align="Center" variant="p">
                {get(row, 'title_of_expense_or_revenue')}
              </Typography>
            );
          },
        },
      },
      {
        name: 'credit_amount',
        label: 'Credit',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            const row = tableMeta.tableData[tableMeta.rowIndex];
            return (
              <Typography align="right" variant="h6">
                +R{get(row, 'credit_amount')}
              </Typography>
            );
          },
        },
      },
      {
        name: 'debit_amount',
        label: 'Debit',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            const row = tableMeta.tableData[tableMeta.rowIndex];
            return (
              <Typography align="right" variant="h6">
                -R{get(row, 'debit_amount')}
              </Typography>
            );
          },
        },
      },
      {
        name: 'balance_amount',
        label: 'Balance',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            const row = tableMeta.tableData[tableMeta.rowIndex];
            return (
              <Typography align="right" variant="h6">
                R{get(row, 'balance_amount')}
              </Typography>
            );
          },
        },
      },
    ];

    const options = {
      filterType: 'checkbox',
      print: true,
      download: true,
      isRowSelectable: false,
      selectableRows: 'none',
      resizableColumns: true,
      responsive: 'stacked',
      selectableRowsHideCheckboxes: true,
    };

    return <>{!isLoading && <MUIDataTable data={data.data} columns={columns} options={options} />}</>;
  };

  return (
    <Page title="Profile">
      <Typography align="Center" variant="h4">
        <img alt="FAQs" width={150} style={{ margin: 'auto' }} src="/static/illustrations/undraw_pay_online.svg" />
        Jua Wallet
      </Typography>
      <Typography variant="p" component="h6" align="center" sx={{ mb: 5 }}>
        Available: R{get(head(get(data, 'data')), 'balance_amount', 0)}
      </Typography>
      <ReusableTabs
        tabHeadings={['Add Funds', 'History']}
        tabContents={[<JuaWalletPaymentForm />, renderTransactionLedger()]}
      />
    </Page>
  );
}
