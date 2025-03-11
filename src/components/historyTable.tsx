import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";

import { Pagination } from "@heroui/pagination";

export const trades = [
  {
    date: "20/02/22",
    ticket: "82547546",
    symbol: "USDJPY",
    type: "BUY",
    price: "152.25",
    profit: "0.525"
  },
  {
    date: "20/02/22",
    ticket: "82547544",
    symbol: "USDJPY",
    type: "BUY",
    price: "152.25",
    profit: "0.525"
  },
  {
    date: "20/02/22",
    ticket: "82547549",
    symbol: "USDJPY",
    type: "BUY",
    price: "152.25",
    profit: "0.525"
  },
  {
    date: "20/02/22",
    ticket: "82547576",
    symbol: "USDJPY",
    type: "BUY",
    price: "152.25",
    profit: "0.525"
  },
  {
    date: "20/02/22",
    ticket: "62547546",
    symbol: "USDJPY",
    type: "BUY",
    price: "152.25",
    profit: "0.525"
  }
];

export default function HistoryTrades() {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(trades.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return trades.slice(start, end);
  }, [page, trades]);

  return (
    <Table
      aria-label="Example table with client side pagination"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
    >
      <TableHeader>
        <TableColumn key="date">Date</TableColumn>
        <TableColumn key="ticket">Ticket</TableColumn>
        <TableColumn key="symbol">Symbol</TableColumn>
        <TableColumn key="type">Type</TableColumn>
        <TableColumn key="price">Price</TableColumn>
        <TableColumn key="profit">Profit</TableColumn>
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow className="text-foreground" key={item.ticket}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

