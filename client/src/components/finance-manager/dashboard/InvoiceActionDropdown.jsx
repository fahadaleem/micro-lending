import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { MoreHorizontal, Link, CheckCircle, Trash2 } from "lucide-react";
import { invoicesApi } from "../../../services/api";
import { toast } from "react-hot-toast";
import React from "react";
import ConfirmationModal from "../../ui/ConfirmationModal";

export default function InvoiceActionsDropdown({
  invoiceId,
  isPaid,
  onUpdated,
}) {
  const [openDelete, setOpenDelete] = React.useState(false);
  const handleGenerateLink = async () => {
    try {
      const { token, expiresAt } = await invoicesApi.generatePaymentLink(
        invoiceId
      );
      const url = `${window.location.origin}/pay/${token}`;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Payment link copied to clipboard");
      } else {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.success("Payment link copied to clipboard");
      }
    } catch (err) {
      console.error("Failed to generate link:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to generate link"
      );
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      const updated = await invoicesApi.markAsPaid(invoiceId);
      console.log(`Invoice ${invoiceId} marked as paid.`);
      if (updated?.payment_status === "paid") {
        toast.success("Invoice marked as paid");
      } else {
        toast.success("Status updated");
      }
      if (typeof onUpdated === "function") {
        await onUpdated();
      }
    } catch (err) {
      console.error("Failed to mark as paid:", err);
      toast.error(err?.message || "Failed to mark as paid");
    }
  };

  // Copy invoice number action removed per requirement

  const handleDeleteInvoice = async () => {
    try {
      await invoicesApi.deleteInvoice(invoiceId);
      toast.success("Invoice deleted");
      if (typeof onUpdated === "function") {
        await onUpdated();
      }
    } catch (err) {
      console.error("Failed to delete invoice:", err);
      toast.error(err?.message || "Failed to delete invoice");
    } finally {
      setOpenDelete(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        {/* Trigger Button (The three dots) */}
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu for {invoiceId}</span>
            <MoreHorizontal className='h-4 w-4 text-gray-500' />
          </Button>
        </DropdownMenuTrigger>

        {/* Menu Content */}
        <DropdownMenuContent align='end' className='w-60'>
          {/* Action 1: Generate Payment Link */}
          <DropdownMenuItem
            onClick={isPaid ? undefined : handleGenerateLink}
            className={`cursor-pointer ${
              isPaid ? "opacity-50 pointer-events-none" : ""
            }`}
            disabled={isPaid}
            tabIndex={isPaid ? -1 : 0}
            aria-disabled={isPaid}
          >
            <Link className='mr-2 h-4 w-4 text-gray-500' />
            <span>Generate payment link</span>
          </DropdownMenuItem>

          {/* Action 2: Mark as Paid (disabled with tooltip if already paid) */}
          <DropdownMenuItem
            onClick={isPaid ? undefined : handleMarkAsPaid}
            className={`cursor-pointer ${
              isPaid ? "opacity-50 pointer-events-none" : ""
            }`}
            disabled={isPaid}
            tabIndex={isPaid ? -1 : 0}
            aria-disabled={isPaid}
          >
            <CheckCircle className='mr-2 h-4 w-4 text-gray-500' />
            Mark as paid
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Action: Delete Invoice */}
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className='cursor-pointer text-red-600 focus:text-red-700'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete invoice
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationModal
        open={openDelete}
        onOpenChange={setOpenDelete}
        title='Delete invoice'
        description={`Are you sure you want to delete invoice ${invoiceId}? This action cannot be undone.`}
        confirmLabel='Delete'
        cancelLabel='Cancel'
        confirmVariant='destructive'
        onConfirm={handleDeleteInvoice}
      />
    </>
  );
}
