import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@heroui/table";
import React, { useEffect, useState } from "react";

import { TradeHistoryData } from "@/types/types";
import { Pagination } from "@heroui/pagination";
import { useSession } from "next-auth/react";

export default function HistoryTrades() {
  const [page, setPage] = useState(1);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [fetched, setFetched] = useState<TradeHistoryData[]>([]);
  const [pages, setPages] = useState<number>(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fecthData = async () => {
      try {
        if (status == "authenticated") {
          const response = await fetch('/api/dashboard/tradeslog', {
            method: "POST",
            body: JSON.stringify({ data: { id: session.user.id } })
          });
          if (!response.ok) {
            throw new Error('Error fetching log');
          }
          const data = await response.json();
          // console.log(data)
          const converted = Array.isArray(data.trades) ? data.trades : []
          setFetched(converted.reverse());
          setPages(Math.ceil(converted.length / rowsPerPage))
          setLoading(false)
        }
      }
      catch (error) {
        console.error('Error fetching log:', error);
      }
    }
    fecthData();
  }, [status]);


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
        <TableColumn key="profit">Profit (฿)</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={"No Trades Found"}
        isLoading={loading}
        items={items}>
        {(item: TradeHistoryData) => (
          <TableRow className="text-foreground" key={item.ticket}>
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

