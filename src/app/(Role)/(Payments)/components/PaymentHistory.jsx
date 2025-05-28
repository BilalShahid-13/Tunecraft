"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const paymentData = [
  {
    date: "April 04, 2025",
    project: "Name of project",
    amount: "$456.50",
    status: "Paid",
  },
  {
    date: "April 04, 2025",
    project: "Name of project",
    amount: "$456.50",
    status: "Paid",
  },
  {
    date: "April 04, 2025",
    project: "Name of project",
    amount: "$456.50",
    status: "Paid",
  },
  {
    date: "April 04, 2025",
    project: "Name of project",
    amount: "$456.50",
    status: "Paid",
  },
  {
    date: "April 04, 2025",
    project: "Name of project",
    amount: "$456.50",
    status: "Pending",
  },
]

export function PaymentHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentData.map((payment, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium font-inter">{payment.date}</TableCell>
                <TableCell>{payment.project}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant={payment.status === "Paid" ? "default" : "secondary"}
                    className={
                      payment.status === "Paid"
                        ? "bg-green-500/30 text-white hover:bg-green-300/40"
                        : "bg-orange-500/30 text-white hover:bg-yellow-300/40"
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {payment.status === "Paid" ? (
                    <Button variant="ghost" size="sm"
                      className={'text-primary hover:text-red-400 cursor-pointer font-inter'}>
                      <Download className="h-4 w-4 mr-2 " />
                      Download
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
