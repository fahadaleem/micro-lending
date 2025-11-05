import React from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { invoicesApi } from "../services/api";
import { toast } from "react-hot-toast";

export default function PayInvoice() {
  const { token } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [invoice, setInvoice] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const inv = await invoicesApi.getPublicInvoiceByToken(token);
        if (mounted) setInvoice(inv);
      } catch (e) {
        setError(
          e?.response?.data?.message || e?.message || "Invalid or expired link"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token]);

  const handlePay = async () => {
    setSubmitting(true);
    try {
      await invoicesApi.payByToken(token);
      toast.success("Payment successful");
      setInvoice((prev) => ({ ...prev, payment_status: "paid" }));
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className='p-6 text-center'>Loading…</div>;
  if (error) return <div className='p-6 text-center text-red-600'>{error}</div>;

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-lg'>
        <CardHeader>
          <CardTitle className='text-xl'>Pay Invoice</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Invoice</span>
            <span className='font-medium'>{invoice?.identifier}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Customer</span>
            <span className='font-medium'>{invoice?.customer_name}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Company</span>
            <span className='font-medium'>{invoice?.company || "-"}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Amount due</span>
            <span className='font-semibold'>
              ${Number(invoice?.amount_due || 0).toFixed(2)}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Due date</span>
            <span className='font-medium'>{invoice?.due_date || "-"}</span>
          </div>
          <div className='pt-2'>
            <Button
              className='w-full'
              onClick={handlePay}
              disabled={submitting || invoice?.payment_status === "paid"}
            >
              {invoice?.payment_status === "paid"
                ? "Already paid"
                : submitting
                ? "Processing…"
                : "Pay now"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
