"use client";
import React, { useEffect } from "react";
import { Expand, File, Home, LineChart, ListFilter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTransactionStore } from "@/store/transactionStore";
import { Deposit, Exchange, Withdrawal } from "@prisma/client";
import { formatDate } from "date-fns";

const Transactions = () => {
  const { transactions, getTransactions }: any = useTransactionStore(
    (state) => state
  );

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdraws">Withdraws</TabsTrigger>
          <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Fulfilled
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Export</span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>View all your transactions here</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead className="">Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction: any) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="font-medium">{transaction.id}</div>
                    </TableCell>
                    <TableCell className="">{transaction.type}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className="text-xs" variant="outline">
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(transaction.createdAt, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="">
                      ₮{" "}
                      {transaction.type === "EXCHANGE"
                        ? transaction.fromAmount
                        : transaction.amount}
                    </TableCell>
                    <TableCell className="">
                      <Dialog>
                        <DialogTrigger>
                          <Button variant="default" size="icon">
                            <Expand className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Transaction Details</DialogTitle>
                            <DialogDescription>
                              All the details of the transaction
                            </DialogDescription>
                          </DialogHeader>
                          <div className="">
                            <pre className=" p-4 bg-gray-100 rounded-md">
                              {JSON.stringify(transaction, undefined, 2)}
                            </pre>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="deposits">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>View all your transactions here</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead className="">Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions
                  .filter((transaction: any) => transaction.type === "DEPOSIT")
                  .map((transaction: any) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="font-medium">{transaction.id}</div>
                      </TableCell>
                      <TableCell className="">{transaction.type}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className="text-xs" variant="outline">
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(transaction.createdAt, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="">
                        ₮{" "}
                        {transaction.type === "EXCHANGE"
                          ? transaction.fromAmount
                          : transaction.amount}
                      </TableCell>
                      <TableCell className="">
                        <Dialog>
                          <DialogTrigger>
                            <Button variant="default" size="icon">
                              <Expand className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                              <DialogDescription>
                                All the details of the transaction
                              </DialogDescription>
                            </DialogHeader>
                            <div className="">
                              <pre className=" p-4 bg-gray-100 rounded-md">
                                {JSON.stringify(transaction, undefined, 2)}
                              </pre>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="withdraws">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>View all your transactions here</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead className="">Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions
                  .filter((transaction: any) => transaction.type === "WITHDRAW")
                  .map((transaction: any) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="font-medium">{transaction.id}</div>
                      </TableCell>
                      <TableCell className="">{transaction.type}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className="text-xs" variant="outline">
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(transaction.createdAt, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="">
                        ₮{" "}
                        {transaction.type === "EXCHANGE"
                          ? transaction.fromAmount
                          : transaction.amount}
                      </TableCell>
                      <TableCell className="">
                        <Dialog>
                          <DialogTrigger>
                            <Button variant="default" size="icon">
                              <Expand className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                              <DialogDescription>
                                All the details of the transaction
                              </DialogDescription>
                            </DialogHeader>
                            <div className="">
                              <pre className=" p-4 bg-gray-100 rounded-md">
                                {JSON.stringify(transaction, undefined, 2)}
                              </pre>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="exchanges">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>View all your transactions here</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead className="">Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions
                  .filter((transaction: any) => transaction.type === "EXCHANGE")
                  .map((transaction: any) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="font-medium">{transaction.id}</div>
                      </TableCell>
                      <TableCell className="">{transaction.type}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className="text-xs" variant="outline">
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(transaction.createdAt, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="">
                        ₮{" "}
                        {transaction.type === "EXCHANGE"
                          ? transaction.fromAmount
                          : transaction.amount}
                      </TableCell>
                      <TableCell className="">
                        <Dialog>
                          <DialogTrigger>
                            <Button variant="default" size="icon">
                              <Expand className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                              <DialogDescription>
                                All the details of the transaction
                              </DialogDescription>
                            </DialogHeader>
                            <div className="">
                              <pre className=" p-4 bg-gray-100 rounded-md">
                                {JSON.stringify(transaction, undefined, 2)}
                              </pre>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Transactions;
