import React, { useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import { TradeHistoryData } from "@/types/types";

// export const trades = [
//   {
//     date: "20/02/22",
//     ticket: "82547546",
//     symbol: "USDJPY",
//     type: "BUY",
//     price: "152.25",
//     profit: "0.525"
//   },
//   {
//     date: "20/02/22",
//     ticket: "82547544",
//     symbol: "USDJPY",
//     type: "BUY",
//     price: "152.25",
//     profit: "0.525"
//   },
//   {
//     date: "20/02/22",
//     ticket: "82547549",
//     symbol: "USDJPY",
//     type: "BUY",
//     price: "152.25",
//     profit: "0.525"
//   },
//   {
//     date: "20/02/22",
//     ticket: "82547576",
//     symbol: "USDJPY",
//     type: "BUY",
//     price: "152.25",
//     profit: "0.525"
//   },
//   {
//     date: "20/02/22",
//     ticket: "62547546",
//     symbol: "USDJPY",
//     type: "BUY",
//     price: "152.25",
//     profit: "0.525"
//   }
// ];

export default function HistoryTrades() {
  const [page, setPage] = useState(1);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [fetched, setFetched] = useState<TradeHistoryData[]>([]);
  const [pages, setPages] = useState<number>(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fecthData = async () => {
      if (status != "authenticated") {
        return
      }
      try {
        const response = await fetch('/api/dashboard/tradeslog', {
          method: "POST",
          body: JSON.stringify({ data: { id: session?.user.id } })
        });
        if (!response.ok) {
          throw new Error('Error fetching log');
        }
        const data = await response.json();
        // console.log(data)
        const converted = Array.isArray(data.trades) ? data.trades : []
        setFetched(converted);
        setPages(Math.ceil(converted.length / rowsPerPage))
        // console.log(converted)
        // console.log(converted.length())
        // console.log(typeof (converted))
        setLoading(false)
      }
      catch (error) {
        console.error('Error fetching log:', error);
      }
    }
    fecthData();
  }, [status]);

  // setPages(Math.ceil(fetched.length() | 1 / rowsPerPage))
  // console.log(typeof fetched)
  // console.log(Array.isArray(fetched), fetched.length);
  // console.log(fetched)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return fetched.slice(start, end);
  }, [page, fetched]);

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
      <TableBody
        emptyContent={"No Trades Found"}
        items={items}>
        {(item: TradeHistoryData) => (
          <TableRow className="text-foreground" key={Math.random()}>
            <TableCell>{item.closeTime}</TableCell>
            <TableCell>{item.ticket}</TableCell>
            <TableCell>{item.symbol}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell>{item.profit}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

