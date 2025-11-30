export interface MarqueeProps {
  items?: string[];
}

export function Marquee({ items = [] }: MarqueeProps) {
  const loopedItems = items.length > 0 ? [...items, ...items, ...items] : items;

  return (
    <div className="bg-primary text-primary-foreground caption-20 h-full w-full overflow-hidden py-3">
      <div className="animate-marquee flex items-center px-4 whitespace-nowrap">
        {loopedItems.map((item, index) => (
          <div key={index} className="flex items-center gap-6 pr-6">
            <span>{item}</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7 0H8V1V2V3H9H10V4H9H8H7H6H5V3H6H7V2V1V0ZM4 5H5V4H4V3H3V2H2V1H1V2H2V3H3V4H4V5ZM4 10H3V9V8H2H1H0V7H1H2H3V6V5H4V6V7V8V9V10ZM5 11V10H4V11H3V12H2V13H1V14H2V13H3V12H4V11H5ZM10 11V12H9H8V13V14V15H7V14V13V12H6H5V11H6H7H8H9H10ZM11 10H10V11H11V12H12V13H13V14H14V13H13V12H12V11H11V10ZM11 5H12V6V7H13H14H15V8H14H13H12V9V10H11V9V8V7V6V5ZM11 4V5H10V4H11ZM12 3V4H11V3H12ZM13 2H12V3H13V2ZM13 2V1H14V2H13Z"
                fill="#F5F5F5"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
