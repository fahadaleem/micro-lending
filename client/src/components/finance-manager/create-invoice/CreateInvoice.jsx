import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceSchema } from "../../../lib/validation.js";

import { Hash, Mail, Phone, User, Building, DollarSign } from "lucide-react";
import { paymentStatusOptions } from "../../../lib/appConstants";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  cn,
  getFirstErrorMessage,
  getDefaultInvoiceValues,
  transformInvoiceFormToPayload,
} from "../../../lib/utils";
import { useLayoutEffect } from "react";
import { useHeader } from "../HeaderContext";
import { useNavigate } from "react-router-dom";
import { invoicesApi } from "../../../services/api";
import toast from "react-hot-toast";
import DateField from "../dashboard/fields/DateField";

export default function CreateInvoice() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(InvoiceSchema),
    mode: "onChange",
    defaultValues: getDefaultInvoiceValues(),
  });

  const onSubmit = async (values) => {
    const payload = transformInvoiceFormToPayload(values);
    try {
      await invoicesApi.create(payload);
      toast.success("Invoice created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Failed to create invoice");
    }
  };

  // set header for create invoice page — useLayoutEffect so it applies before paint
  const { setHeader, resetHeader } = useHeader();
  useLayoutEffect(() => {
    // compute whether form is currently valid
    const hasErrors = Object.keys(errors || {}).length > 0;
    const disabled = !isValid || isSubmitting || hasErrors;

    // pick a helpful tooltip message (first error message if available)
    const firstErrorMessage = getFirstErrorMessage(errors);

    setHeader({
      title: "Create Invoice",
      actionLabel: "Save Invoice",
      onAction: disabled ? undefined : handleSubmit(onSubmit),
      showAction: true,
      disabled,
      tooltip: disabled
        ? firstErrorMessage || "Please fill the required fields"
        : null,
    });
    return () => resetHeader();
  }, [setHeader, resetHeader, handleSubmit, errors, isSubmitting, isValid]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className='w-full shadow-lg'>
          <CardHeader>
            <CardTitle className='text-2xl font-semibold'>
              Invoice Details
            </CardTitle>
          </CardHeader>

          <CardContent className='space-y-8'>
            <div className='flex gap-6'>
              {/* Invoice Identifier */}
              <div className='space-y-2 flex-1'>
                <Label>Invoice Identifier</Label>
                <div className='relative'>
                  <Input
                    placeholder='e.g., INV-12345'
                    {...register("identifier")}
                    className={cn(
                      "pl-10 h-11",
                      errors.identifier && "border-red-500"
                    )}
                  />
                  <Hash className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                </div>
                {errors.identifier && (
                  <p className='text-sm text-red-500'>
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              {/* Payment Status */}
              <div className='space-y-2 flex-1'>
                <Label>Payment Status</Label>
                <Controller
                  control={control}
                  name='paymentStatus'
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={cn(
                          errors.paymentStatus && "border-red-500",
                          "w-full h-11"
                        )}
                      >
                        <SelectValue placeholder='Select Status' />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.paymentStatus && (
                  <p className='text-sm text-red-500'>
                    {errors.paymentStatus.message}
                  </p>
                )}
              </div>
            </div>
            {/* Invoice Date & Due Date (grid) */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Invoice Date</Label>
                <Controller
                  control={control}
                  name='invoiceDate'
                  render={({ field }) => (
                    <DateField
                      value={field.value || ""}
                      onChange={field.onChange}
                      selectedFilterId='invoiceDate'
                    />
                  )}
                />
                {errors.invoiceDate && (
                  <p className='text-sm text-red-500'>
                    {errors.invoiceDate.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label>Due Date</Label>
                <Controller
                  control={control}
                  name='dueDate'
                  render={({ field }) => (
                    <DateField
                      value={field.value || ""}
                      onChange={field.onChange}
                      selectedFilterId='dueDate'
                    />
                  )}
                />
                {errors.dueDate && (
                  <p className='text-sm text-red-500'>
                    {errors.dueDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Amount Due & Reference (inline) */}
            <div className='flex gap-6'>
              <div className='space-y-2 flex-1'>
                <Label>Amount Due</Label>
                <div className='relative'>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='0.00'
                    {...register("amountDue", { valueAsNumber: true })}
                    className={cn(
                      "pl-10 h-11",
                      errors.amountDue && "border-red-500"
                    )}
                  />
                  <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                </div>
                {errors.amountDue && (
                  <p className='text-sm text-red-500'>
                    {errors.amountDue.message}
                  </p>
                )}
              </div>

              <div className='space-y-2 flex-1'>
                <Label>Reference / PO Number</Label>
                <Input
                  placeholder='Optional'
                  {...register("reference")}
                  className='h-11'
                />
              </div>
            </div>

            {/* Notes */}
            <div className='space-y-2'>
              <Label>Notes to Customer</Label>
              <Textarea
                placeholder='Add any additional details...'
                {...register("notesToCustomer")}
              />
            </div>

            {/* Customer Details */}
            <h3 className='text-xl font-semibold mt-8'>Customer Information</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Field
                id='customerName'
                label='Customer Name'
                icon={User}
                register={register}
                name='customerName'
                error={errors.customerName?.message}
              />
              <Field
                id='company'
                label='Company / Organization'
                icon={Building}
                register={register}
                name='company'
                error={errors.company?.message}
              />
              <Field
                id='email'
                label='Email'
                icon={Mail}
                register={register}
                name='email'
                error={errors.email?.message}
              />
              <Field
                id='phone'
                label='Phone'
                icon={Phone}
                register={register}
                name='phone'
                error={errors.phone?.message}
              />
            </div>

            {/* Billing Address */}
            <div className='space-y-2'>
              <Label>Billing Address</Label>
              <Textarea
                placeholder='Street, City, State, ZIP, Country'
                {...register("billingAddress")}
                className={cn(errors.billingAddress && "border-red-500")}
              />
              {errors.billingAddress && (
                <p className='text-sm text-red-500'>
                  {errors.billingAddress.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  );
}

/* ---------- Helper Components ---------- */

const Field = ({ id, label, icon: Icon, register, name, error }) => (
  <div className='space-y-2'>
    <Label htmlFor={id}>{label}</Label>
    <div className='relative'>
      <Input
        id={id}
        placeholder={label}
        {...register(name)}
        className={cn("pl-10", error && "border-red-500")}
      />
      <Icon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
    </div>
    {error && <p className='text-sm text-red-500'>{error}</p>}
  </div>
);
