"use client"

import React, { useEffect, useState } from "react";
import {

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
import { Button } from "@heroui/button";
import createBillsForTradeLogs from "@/utils/functions";

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

export default function TestingComponent() {
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

  const CallFn = async (e: any) => {
    setLoading(true);

    const response = await fetch('/api/web_data', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: { fee: 0.01 } })
    });

    const result = await response.json();
    if (result.error) {
      console.log(result.error)
    }
    setLoading(false);
  }

  const handleCreateBills = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/callcreatebill", { method: "POST" });

      if (!response.ok) throw new Error("Failed to create bills");

      const data = await response.json();
      console.log(data.message);
    } catch (error: any) {
      console.log("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button color="primary" onPress={handleCreateBills}>Testing Bill Create Schedule Function</Button>
      <Button color="warning" onPress={CallFn}>Admin input</Button>
    </div>
  );
}

