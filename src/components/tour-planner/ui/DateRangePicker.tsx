// Date range picker component
'use client';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  startLabel?: string;
  endLabel?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startLabel = "Start Date",
  endLabel = "End Date",
  className = "",
  disabled = false,
  required = false
}: DateRangePickerProps) {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {startLabel}
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-french-blue)] focus:border-transparent bg-white shadow-sm"
          disabled={disabled}
          required={required}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {endLabel}
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-french-blue)] focus:border-transparent bg-white shadow-sm"
          disabled={disabled}
          required={required}
        />
      </div>
    </div>
  );
}