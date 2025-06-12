"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Currency } from '@/lib/Constant'
import usePaymentStore from '@/store/payment'
import { CheckCircle, Clock, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"


export default function PaymentCard() {
  const { totalEarnings, pendingPayment, paymentRecords } = usePaymentStore()
  const [lastPayment, setLastPayment] = useState(null)
  useEffect(() => {
    const payment = paymentRecords
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort descending by date
      .shift();
    setLastPayment(payment ? payment.price : 0)
  }, [paymentRecords])

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{`${Currency} ${totalEarnings}`}</div>
          <div className="flex items-center text-xs text-green-600">
            {/* <TrendingUp className="mr-1 h-3 w-3" />
            +12.5% from last month */}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{`${Currency} ${pendingPayment}`}</div>
          {/* <p className="text-xs text-muted-foreground">Expected on August 15, 2023</p> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{`${Currency} ${lastPayment}`}</div>
          {/* <p className="text-xs text-muted-foreground">Received on July 30, 2023</p> */}
        </CardContent>
      </Card>
    </div>
  )
}
