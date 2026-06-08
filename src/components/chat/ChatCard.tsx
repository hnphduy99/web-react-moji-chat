import { MoreHorizontal } from 'lucide-react';
import { cn, formatOnlineTime } from '~/lib/utils';

interface ChatCardProps {
  dataId: string;
  name: string;
  timestamps?: Date;
  isActive: boolean;
  onSelect: (id: string) => void;
  unreadCounts: number;
  leftSection: React.ReactNode;
  subTitle: React.ReactNode;
}

const ChatCard = ({
  dataId,
  name,
  timestamps,
  isActive,
  onSelect,
  unreadCounts,
  leftSection,
  subTitle
}: ChatCardProps) => {
  return (
    <div
      key={dataId}
      onClick={() => onSelect(dataId)}
      className={cn(
        'relative flex items-center gap-3 px-3 py-2.5 rounded-xl bg-background glass hover:shadow-soft transition-smooth cursor-pointer transition-all duration-200 group/card',
        'hover:bg-muted/50',
        isActive ? 'bg-primary/8 border border-primary/20' : 'border border-transparent'
      )}
    >
      {/* Active left indicator */}
      {isActive && (
        <div className='absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-r-full bg-gradient-primary' />
      )}

      {/* Avatar section */}
      <div
        className={cn(
          'relative shrink-0 transition-transform duration-200',
          isActive ? 'scale-105' : 'group-hover/card:scale-105'
        )}
      >
        {leftSection}
      </div>

      {/* Text content */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between mb-0.5'>
          <h3
            className={cn(
              'font-semibold text-sm truncate',
              unreadCounts > 0 ? 'text-foreground' : 'text-foreground/80'
            )}
          >
            {name}
          </h3>
          <span
            className={cn(
              'text-xs ml-2 shrink-0',
              unreadCounts > 0 ? 'text-primary font-medium' : 'text-muted-foreground'
            )}
          >
            {timestamps ? formatOnlineTime(timestamps) : ''}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex-1 min-w-0'>{subTitle}</div>
          <MoreHorizontal className='size-4 text-muted-foreground opacity-0 group-hover/card:opacity-100 hover:size-5 transition-smooth' />
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
