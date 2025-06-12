"use client"
import { useState } from "react";
import { generateInvoicePdfAction } from "@/components/serverComponents/generateInvoicePdfAction"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Currency } from "@/lib/Constant"
import { formatDateTime } from "@/lib/utils"
import usePaymentStore from "@/store/payment"
import { Download, Loader2 } from "lucide-react"

export function PaymentHistory() {
  const { paymentRecords } = usePaymentStore();

  // Loading state for each individual payment item
  const [loadingStates, setLoadingStates] = useState({});

  const handleDownloadInvoice = async (username, crafterId, songGenre, musicTemplate, price, crafterEmail, crafterPhone, createdAt, orderId) => {
    // Set the loading state to true for the specific orderId
    setLoadingStates((prevStates) => ({ ...prevStates, [orderId]: true }));

    console.log({
      username,
      crafterId,
      songGenre,
      musicTemplate,
      price,
      crafterEmail,
      crafterPhone
    });

    try {
      // Call the server action to get the PDF buffer
      const pdfBuffer = await generateInvoicePdfAction(username, crafterId, songGenre, musicTemplate, price, crafterEmail, crafterPhone, createdAt);

      if (!pdfBuffer) {
        throw new Error("No PDF data received from server.");
      }

      // Convert the ArrayBuffer (which Next.js sends from a Node.js Buffer) to a Blob
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice.pdf'; // Suggested filename
      document.body.appendChild(a); // Append to body (required for Firefox)
      a.click(); // Programmatically click the link

      // Clean up the temporary URL and element
      window.URL.revokeObjectURL(url);
      a.remove();

    } catch (error) {
      console.error('Download failed:', error);
      // Use a custom modal or toast notification instead of alert() in production apps
      alert(`Failed to download invoice: ${error.message || 'Unknown error'}`);
    } finally {
      // Set the loading state back to false for the specific orderId
      setLoadingStates((prevStates) => ({ ...prevStates, [orderId]: false }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#OrderId</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentRecords.map((payment, index) => (
              <TableRow key={index}>
                <TableCell className={'uppercase italic'}>{payment.orderId.orderId}</TableCell>
                <TableCell className="font-light text-sm font-inter">{formatDateTime(payment.date).date}</TableCell>
                <TableCell>{payment.projectName}</TableCell>
                <TableCell>{`${Currency} ${payment.price}`}</TableCell>
                <TableCell>
                  <Badge
                    variant={payment.status === "completed" ? "default" : "secondary"}
                    className={
                      payment.status === "completed"
                        ? "bg-green-500/30 text-white hover:bg-green-300/40 capitalize"
                        : "bg-orange-500/30 text-white hover:bg-yellow-300/40 capitalize"
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {payment.status === "completed" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleDownloadInvoice(
                          payment.userId.username,
                          payment.orderId.orderId,
                          payment.orderId.songGenre,
                          payment.orderId.musicTemplate,
                          payment.price,
                          payment.userId.email,
                          payment.userId.phone,
                          payment.orderId.createdAt,
                          payment.orderId.orderId // Pass the orderId to track individual loading states
                        );
                      }}
                      className={'text-primary hover:text-red-400 cursor-pointer font-inter'}
                    >
                      {loadingStates[payment.orderId.orderId] ? (
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />  // Show loading icon when downloading
                      ) : (
                        <Download className="h-4 w-4 mr-2 " />
                      )}
                      {loadingStates[payment.orderId.orderId] ? 'Processing...' : 'Download'}
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
  );
}
