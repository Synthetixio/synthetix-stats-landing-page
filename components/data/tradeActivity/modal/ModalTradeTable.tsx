import { useMemo } from 'react'
import { useTable, useSortBy } from 'react-table'
import { formatMoney, formatNumber } from '../../../../constants/format';
import Down from '../../../icon/Down';
import Up from '../../../icon/Up';
import UpDown from '../../../icon/upDown';
import styles from './ModalTradeTable.module.css'


interface ModalTable  {
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
}




const ModalTradeTable = ({
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
  ninetyTradeStatsAll
}:ModalTable) => {


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
            Cell: (cellProps:any) => {
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
            Cell: ({value}) => { return formatNumber.format(value)}
          },
          {
            Header: 'Volume',
            accessor: 'col3',
            Cell: ({value}) => { return formatMoney.format(value)}
          }
        ],
        []
      )
      // @ts-ignore
      const tableInstance = useTable(
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
       // usePagination
        )

      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        //canNextPage,
       // nextPage,
       // canPreviousPage,
       // previousPage,
        prepareRow,
      } = tableInstance



      
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
                       {   column.isSorted
                               ? <Down/>
                               : column.isSorted ?
                               <Up/> :
                               <UpDown/>}
                    </span>
            </th>
          );
        })}
      </tr>
      )})}
      
    </thead>
    <tbody {...getTableBodyProps()}>
     
    {rows.map((row) => {
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
  

  </div>
    
)
    
    
      }
export default ModalTradeTable

