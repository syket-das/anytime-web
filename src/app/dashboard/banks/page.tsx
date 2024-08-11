"use client";
import Link from "next/link";
import { LandmarkIcon, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBankStore } from "@/store/bankStore";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserBank } from "@prisma/client";

function Page() {
  const [open, setOpen] = useState(false);

  const { banks, getBanks, addBank }: any = useBankStore();
  const [data, setData] = useState({
    bankName: "",
    accountHolderName: "",
    accountNo: "",
    branch: "",
    ifsc: "",
  });
  const [selectedBank, setSelectedBank] = useState<UserBank | null>(null);

  useEffect(() => {
    getBanks();
  }, []);

  const onSave = async () => {
    if (
      data.bankName === "" ||
      data.accountHolderName === "" ||
      data.accountNo === "" ||
      data.branch === "" ||
      data.ifsc === ""
    ) {
      return;
    }
    try {
      await addBank({
        bankName: data.bankName,
        accountName: data.accountHolderName,
        accountNo: data.accountNo,
        branch: data.branch,
        IFSC: data.ifsc,
      });
      setOpen(false);
      getBanks();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 ">
      {/* <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div> */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Bank Accounts</CardTitle>
              <CardDescription>List of all the bank accounts</CardDescription>
            </div>
            <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
              <DialogTrigger asChild>
                <Button asChild size="sm" className="ml-auto gap-1">
                  <Link href="#">
                    Add New <Plus className="h-4 w-4" />
                  </Link>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Account</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new bank account
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 w-full">
                  <div className="">
                    <Label htmlFor="name">Bank Name</Label>
                    <Input
                      value={data.bankName}
                      onChange={(e) =>
                        setData({ ...data, bankName: e.target.value })
                      }
                      type="text"
                      id="name"
                      placeholder="Enter Bank Name"
                    />
                  </div>
                  <div className="">
                    <Label htmlFor="accHolderName">Account Holder Name</Label>
                    <Input
                      value={data.accountHolderName}
                      onChange={(e) =>
                        setData({ ...data, accountHolderName: e.target.value })
                      }
                      type="text"
                      id="accHolderName"
                      placeholder="Enter Account Holder Name"
                    />
                  </div>

                  <div className="">
                    <Label htmlFor="accountNo">Account Number</Label>
                    <Input
                      value={data.accountNo}
                      onChange={(e) =>
                        setData({ ...data, accountNo: e.target.value })
                      }
                      type="text"
                      id="accountNo"
                      placeholder="Enter Account Number"
                    />
                  </div>
                  <div className="">
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      value={data.branch}
                      onChange={(e) =>
                        setData({ ...data, branch: e.target.value })
                      }
                      type="text"
                      id="branch"
                      placeholder="Enter Branch"
                    />
                  </div>
                  <div className="">
                    <Label htmlFor="ifsc">IFSC Code</Label>
                    <Input
                      value={data.ifsc}
                      onChange={(e) =>
                        setData({ ...data, ifsc: e.target.value })
                      }
                      type="text"
                      id="ifsc"
                      placeholder="Enter IFSC Code"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button
                    onClick={onSave}
                    disabled={
                      data.bankName === "" ||
                      data.accountHolderName === "" ||
                      data.accountNo === "" ||
                      data.branch === "" ||
                      data.ifsc === ""
                    }
                  >
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank Name</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Account Holder Name
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Branch</TableHead>
                  <TableHead className="hidden lg:table-cell">IFSC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banks.map((bank: UserBank) => (
                  <TableRow key={bank.id}>
                    <TableCell>
                      <Badge>{bank.bankName}</Badge>
                    </TableCell>
                    <TableCell className="">{bank.accountNo}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {bank.accountName}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {bank.branch}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {bank.IFSC}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant={
                          selectedBank?.id === bank.id ? "default" : "outline"
                        }
                        onClick={() => setSelectedBank(bank)}
                      >
                        {selectedBank?.id === bank.id ? "Selected" : "Select"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-5">
          <CardContent className="mt-8">
            <div className="w-96 h-56 m-auto bg-red-100 rounded-xl relative text-white shadow-2xl transition-transform transform hover:scale-105">
              <img
                className="relative object-cover w-full h-full rounded-xl"
                src="https://i.imgur.com/kGkSg1v.png"
              />

              <div className="w-full px-8 absolute top-8">
                <div className="flex justify-between">
                  <div className="">
                    <p className="font-bold">
                      {selectedBank?.bankName || "Bank Name"}
                    </p>
                    <p className="font-medium tracking-widest text-sm">
                      {selectedBank?.accountName || "Account Holder Name"}
                    </p>
                  </div>

                  <LandmarkIcon className="w-14 h-14" />
                </div>
                <div className="pt-1">
                  <p className="font-light">Account Number</p>
                  <p className="font-medium tracking-more-wider">
                    {selectedBank?.accountNo || "XXXX-XXXX-XXXX-XXXX"}
                  </p>
                </div>
                <div className="pt-6 pr-6">
                  <div className="flex justify-between">
                    <div className="">
                      <p className="font-light text-xs">IFSC</p>
                      <p className="font-medium tracking-wider text-sm">
                        {selectedBank?.IFSC || "IFSC"}
                      </p>
                    </div>
                    <div className="">
                      <p className="font-light text-xs ">Branch</p>
                      <p className="font-medium tracking-wider text-sm">
                        {selectedBank?.branch || "Branch"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Page;
