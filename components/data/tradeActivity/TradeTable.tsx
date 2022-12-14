import { useMemo } from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import { formatMoney, formatNumber } from '../../../constants/format';
import styles from './TradeTable.module.css'
import { MdChevronLeft, MdChevronRight, MdFirstPage, MdLastPage } from 'react-icons/md'
import UpDown from '../../icon/upDown';
import Up from '../../icon/Up';
import Down from '../../icon/Down';



interface table {
  click: number;
  tableId: number;
  totalTradeStatsOvm: any[]
  dailyTradeStatsOvm: any[]
  thirtyTradeStatsOvm: any[]
  sevenTradeStatsOvm: any[]
  ninetyTradeStatsOvm: any[]
  dailyTradeStatsMain: any[]
  totalTradeStatsMain: any[]
  thirtyTradeStatsMain: any[]
  sevenTradeStatsMain: any[]
  ninetyTradeStatsMain: any[]
  totalTradeStatsAll: any[]
  dailyTradeStatsAll: any[]
  sevenTradeStatsAll: any[]
  thirtyTradeStatsAll: any[]
  ninetyTradeStatsAll: any[]
  mainTrade: string;
  ovmTrade: string;
  allTrade: string;
  mainVolume: string;
  ovmVolume: string;
  allVolume: string;
}




const TradeTable = ({
  click,
  tableId,
  totalTradeStatsAll,
  totalTradeStatsMain,
  totalTradeStatsOvm,
  dailyTradeStatsMain,
  dailyTradeStatsOvm,
  sevenTradeStatsMain,
  sevenTradeStatsOvm,
  thirtyTradeStatsMain,
  thirtyTradeStatsOvm,
  ninetyTradeStatsMain,
  ninetyTradeStatsOvm,
  dailyTradeStatsAll,
  sevenTradeStatsAll,
  thirtyTradeStatsAll,
  ninetyTradeStatsAll,
  mainTrade,
  ovmTrade,
  allTrade,
  mainVolume,
  ovmVolume,
  allVolume
}: table) => {



  const ovmData = tableId === 0 ? dailyTradeStatsOvm : tableId === 1 ? sevenTradeStatsOvm : tableId === 2 ? thirtyTradeStatsOvm : tableId === 3 ? ninetyTradeStatsOvm : totalTradeStatsOvm
  const mainData = tableId === 0 ? dailyTradeStatsMain : tableId === 1 ? sevenTradeStatsMain : tableId === 2 ? thirtyTradeStatsMain : tableId === 3 ? ninetyTradeStatsMain : totalTradeStatsMain
  const allData = tableId === 0 ? dailyTradeStatsAll : tableId === 1 ? sevenTradeStatsAll : tableId === 2 ? thirtyTradeStatsAll : tableId === 3 ? ninetyTradeStatsAll : totalTradeStatsAll


  const tradeTable = click === 1 ? mainData : click === 10 ? ovmData : allData

  const data = useMemo(
    () => tradeTable,
    [tradeTable]
  )


  const columns = useMemo(
    () => [
      /*{
         Header: "Index",
         accessor: (_row: any, i : number) => i + 1,
       },*/
      {
        Header: 'Protocol',
        accessor: 'col1', // accessor is the "key" in the data
        Cell: (cellProps: any) => {
          return (
            <span
              className={
                cellProps.value === "1INCH" ?
                  styles.oneInch :
                  cellProps.value === "0X" ?
                    styles.zeroX :
                  cellProps.value === "0" ?
                    styles.OTHER :
                    styles[cellProps.value]}>
              {cellProps.value}
            </span>
          );
        },
      },
      {
        Header: 'N of Trades',
        accessor: 'col2',
        Cell: ({ value }: any) => { return formatNumber.format(value) }
      },
      {
        Header: 'Volume',
        accessor: 'col3',
        Cell: ({ value }: any) => { return formatMoney.format(value) }
      }
    ],
    []
  )
  // @ts-ignore
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    canNextPage,
    nextPage,
    canPreviousPage,
    previousPage,
    gotoPage,
    pageOptions,
    pageCount,
    prepareRow,
    state: { pageIndex }
  } = useTable(
    //@ts-ignore
    {
      //@ts-ignore
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: 'col3',
            desc: true,
          },
        ],
        pageSize: 4,
      }
    },
    useSortBy,
    usePagination
  )






  return (
    <div>
      <table {...getTableProps()} className={styles.mainTable}>
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps()
            return (

              <tr key={key} {...restHeaderGroupProps} className={styles.headRow}>
                {headerGroup.headers.map((column) => {
                  const { key, ...restColumn } = column.getHeaderProps(column.getSortByToggleProps());
                  return (
                    <th key={key} {...restColumn} className={styles.headKey}>
                      {column.render("Header")}
                      <span className={styles.sorted}>
                        {
                          column.isSorted
                            ? <Down />
                            : column.isSorted ?
                              <Up /> :
                              <UpDown />
                        }

                      </span>
                    </th>
                  );
                })}
              </tr>
            )
          })}

        </thead>
        <tbody {...getTableBodyProps()} className={styles.mainBody}>

          {page.map((row) => {
            prepareRow(row);
            const { key, ...restRowProps } = row.getRowProps();
            return (

              <tr key={key} {...restRowProps} className={styles.mainRow}>
                {row.cells.map((cell) => {
                  const { key, ...restCellProps } = cell.getCellProps();
                  return (
                    <td key={key} {...restCellProps} className={
                      cell.column.Header === "Protocol" ?
                        styles.protocolCell :
                        cell.column.Header === "N of Trades" ?
                          styles.nOfTradesCell :
                          cell.column.Header === "Volume" ?
                            styles.volumeCell :
                            styles.mainKey
                    }>
                      {cell.render("Cell")}
                    </td>
                  );
                })}

              </tr>

            );

          })}



        </tbody>
      </table>

      <div className={styles.tableNav}>
        
        <div>
        <button className={styles.chartButton} onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          <MdFirstPage/>
        </button>
        <button className={styles.chartButton} onClick={() => previousPage()} disabled={!canPreviousPage}>
          <MdChevronLeft/>
        </button>
        </div>

        <span className={styles.tableNavKey}>
            {pageIndex + 1} of {pageOptions.length}
        </span>

        <div>
        <button className={styles.chartButton} onClick={() => nextPage()} disabled={!canNextPage}>
          <MdChevronRight/>
        </button>
        <button className={styles.chartButton} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          <MdLastPage/>
        </button>
        </div>
       
        
      </div>
      <div className={styles.theDiv}>

        <div className={styles.bottom}>
          <h5 className={styles.bottomTitle}>Total N of Trades</h5>
          <p className={styles.totalTrades}>
            {click === 1 ? mainTrade : click === 10 ? ovmTrade : allTrade}
          </p>
          <h5 className={styles.bottomTitle}>Total Volume</h5>
          <p className={styles.totalVolume}>
            {click === 1 ? mainVolume : click === 10 ? ovmVolume : allVolume}
          </p>
        </div>
      </div>
    </div>

  )


}
export default TradeTable

