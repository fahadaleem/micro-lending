import React, { useState } from "react";
import { Search, X } from "lucide-react";
import {
  availableFilters,
  operatorsMap,
  paymentStatusOptions,
} from "../../../../src/lib/appConstants";

import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { ScrollArea } from "../../ui/scroll-area";
import { Badge } from "../../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

// Field components (extracted)
import TextField from "./fields/TextField";
import NumberField from "./fields/NumberField";
import DateField from "./fields/DateField";
import SelectField from "./fields/SelectField";

/**
 * Filters component
 *
 * Props:
 * @param {Object} props
 * @param {(filters: Object) => void} props.onApplyFilters - callback when filters are applied or updated
 * @param {boolean} props.isOpen - whether the popover is open
 * @param {(open: boolean) => void} props.onOpenChange - function to change popover open state
 * @param {string|null} props.initialFilterId - optional filter id to select when opening
 * @returns {JSX.Element}
 */
export default function Filters({
  onApplyFilters,
  isOpen,
  onOpenChange,
  initialFilterId,
}) {
  const [selectedFilter, setSelectedFilter] = useState(availableFilters[0]);
  const [filterValue, setFilterValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [operator, setOperator] = useState("equals");
  const [activeChips, setActiveChips] = useState({});

  // operatorsMap moved to constants (imported)

  /**
   * Get operator list for a given filter type
   * @param {string} type - filter type (text|number|date|select)
   * @returns {string[]} list of operator labels
   */
  const getOperatorsFor = (type) => operatorsMap[type] || operatorsMap.text;

  /**
   * Select a filter tab by id and restore any saved operator/value for it
   * @param {string} filterId
   * @returns {void}
   */
  const handleSelectFilter = (filterId) => {
    const filter = availableFilters.find((f) => f.id === filterId);
    setSelectedFilter(filter);
    const existingFilter = activeChips[filterId];
    setOperator(existingFilter?.operator || getOperatorsFor(filter.type)[0]);
    setFilterValue(existingFilter?.value || "");
  };

  /**
   * When `initialFilterId` is provided (parent requested a specific filter), select it.
   */
  React.useEffect(() => {
    if (initialFilterId) {
      const exists = availableFilters.find((f) => f.id === initialFilterId);
      if (exists) handleSelectFilter(initialFilterId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilterId]);

  /**
   * Add or update the chip for the currently selected filter
   * - validates input (non-empty, non-negative for number)
   * @returns {void}
   */
  const handleAddChip = () => {
    if (filterValue === "" || filterValue === null) return;
    if (selectedFilter.type === "number") {
      const num = Number(filterValue);
      if (Number.isNaN(num) || num < 0) return;
    }

    const newChip = {
      id: selectedFilter.id,
      label: selectedFilter.label,
      operator: operator,
      value: filterValue,
    };

    setActiveChips((prev) => ({
      ...prev,
      [selectedFilter.id]: newChip,
    }));
    setFilterValue("");
  };

  /**
   * Remove a filter by id and notify parent with updated filters
   * @param {string} filterId
   * @returns {void}
   */
  const handleRemoveChip = (filterId) => {
    setActiveChips((prev) => {
      const newChips = { ...prev };
      delete newChips[filterId];
      if (onApplyFilters) onApplyFilters(newChips);
      return newChips;
    });
  };

  /**
   * Emit current filters to parent and close the popover
   * @returns {void}
   */
  const handleApplyFilters = () => {
    onApplyFilters(activeChips);
    onOpenChange(false);
  };

  /**
   * Close the popover without applying changes
   * @returns {void}
   */
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
        >
          <Search className='h-4 w-4 mr-2' />
          Add Filter
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className='w-[650px] p-0 flex flex-col h-[480px] max-h-[85vh] shadow-2xl'
        align='start'
      >
        <div className='flex flex-1 overflow-hidden'>
          <div className='w-54 border-r bg-gray-50 p-3 flex flex-col'>
            <Label className='text-sm font-semibold mb-2 text-gray-700'>
              Available Filters
            </Label>
            <div className='mb-2 relative'>
              <TextField
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder='Search filters...'
              />
              {searchQuery && (
                <button
                  type='button'
                  aria-label='Clear search'
                  onClick={() => setSearchQuery("")}
                  className='absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100'
                >
                  <X className='w-3 h-3 text-gray-600' />
                </button>
              )}
            </div>
            <ScrollArea className='h-full'>
              {" "}
              {availableFilters
                .filter((f) => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    f.label.toLowerCase().includes(q) ||
                    f.id.toLowerCase().includes(q)
                  );
                })
                .map((filter) => {
                  const FilterIcon = filter.icon;
                  return (
                    <Button
                      key={filter.id}
                      variant='ghost'
                      onClick={() => handleSelectFilter(filter.id)}
                      className={`w-full justify-start text-sm px-3 py-2 my-1 rounded-lg ${
                        selectedFilter.id === filter.id
                          ? "bg-brand/10 text-brand hover:bg-brand/20"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <FilterIcon className='h-4 w-4 mr-2' />
                      {filter.label}
                    </Button>
                  );
                })}
            </ScrollArea>
          </div>

          <div className='flex-1 p-5 space-y-4 overflow-y-auto'>
            <h3 className='text-base font-semibold text-gray-800'>
              {selectedFilter.label}
            </h3>

            <div className='space-y-2'>
              <Label>Operator</Label>
              <Select value={operator} onValueChange={setOperator}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select operator' />
                </SelectTrigger>
                <SelectContent>
                  {getOperatorsFor(selectedFilter.type).map((op) => (
                    <SelectItem key={op} value={op} className='capitalize'>
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Value</Label>
              <div className='relative flex items-center gap-2'>
                {selectedFilter.type === "text" && (
                  <TextField
                    value={filterValue}
                    onChange={setFilterValue}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && filterValue) {
                        handleAddChip();
                        e.preventDefault();
                      }
                    }}
                    placeholder={`e.g., ${
                      selectedFilter.id === "invoice_number"
                        ? "INV-1042"
                        : "Enter value"
                    }`}
                  />
                )}

                {selectedFilter.type === "number" && (
                  <NumberField
                    value={filterValue}
                    onChange={setFilterValue}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && filterValue !== "") {
                        handleAddChip();
                        e.preventDefault();
                      }
                    }}
                    placeholder='Enter amount'
                  />
                )}

                {selectedFilter.type === "date" && (
                  <DateField
                    value={filterValue}
                    onChange={setFilterValue}
                    selectedFilterId={selectedFilter.id}
                  />
                )}

                {selectedFilter.type === "select" && (
                  <SelectField
                    value={filterValue}
                    onChange={setFilterValue}
                    options={paymentStatusOptions}
                  />
                )}

                <Button
                  onClick={handleAddChip}
                  disabled={
                    selectedFilter.type === "select"
                      ? !filterValue
                      : filterValue === "" || filterValue === null
                  }
                  size='sm'
                  className='bg-brand hover:bg-brand/90 text-white flex-shrink-0'
                >
                  <span className='text-lg'>+</span> Add
                </Button>
              </div>
            </div>

            {activeChips[selectedFilter.id] && (
              <div className='pt-2 flex flex-wrap gap-2'>
                <Badge
                  key={activeChips[selectedFilter.id].id}
                  variant='secondary'
                  className='bg-brand/10 text-brand hover:bg-brand/20 cursor-pointer'
                >
                  {activeChips[selectedFilter.id].label}:{" "}
                  {activeChips[selectedFilter.id].operator} "
                  {activeChips[selectedFilter.id].value}"
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveChip(selectedFilter.id);
                    }}
                    className='ml-1 p-1 rounded hover:bg-brand/20'
                  >
                    <X className='w-3 h-3 text-current' />
                  </button>
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className='flex justify-between items-center p-4 border-t bg-white'>
          <Button variant='outline' onClick={handleCancel} className='w-1/5'>
            Cancel
          </Button>

          <Button
            onClick={handleApplyFilters}
            className='bg-brand hover:bg-brand/90 text-white w-4/5 ml-4'
          >
            Apply Filters ({Object.keys(activeChips).length})
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
