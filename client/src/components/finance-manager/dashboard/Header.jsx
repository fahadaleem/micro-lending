import { PlusCircle } from "lucide-react";
import { Button } from "../../ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "../../ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useHeader } from "../../../contexts/HeaderContext";

export default function Header() {
  const navigate = useNavigate();
  let { options } = { options: {} };
  try {
    // try to read header options from context (if provider present)
    const ctx = useHeader();
    options = ctx.options || {};
  } catch (e) {
    // no provider, fallback
    options = {};
  }

  const defaultNavigateCreate = () => navigate("/invoices/create");

  const title = options.title || "Finance Manager Creditor - Panel";
  const showAction = options.showAction ?? true;
  const actionLabel = options.actionLabel || "Create Invoice";
  const onAction = options.onAction || defaultNavigateCreate;

  return (
    <header className='flex items-center justify-between p-4 bg-white border-b shadow-sm'>
      <h1 className='text-xl font-semibold text-gray-800'>{title}</h1>
      {showAction ? (
        options.disabled && options.tooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='inline-block'>
                <Button
                  disabled={true}
                  className='bg-brand text-white flex items-center gap-2 px-4 py-2 rounded-md transition-colors opacity-60 cursor-not-allowed'
                >
                  <PlusCircle className='h-5 w-5' />
                  {actionLabel}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent side='bottom'>{options.tooltip}</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            className='bg-brand hover:bg-brand-hover text-white flex items-center gap-2 px-4 py-2 rounded-md transition-colors'
            onClick={onAction}
          >
            <PlusCircle className='h-5 w-5' />
            {actionLabel}
          </Button>
        )
      ) : null}
    </header>
  );
}
