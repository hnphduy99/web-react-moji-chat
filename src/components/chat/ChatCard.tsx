import { MoreHorizontal } from 'lucide-react';
import { cn, formatOnlineTime } from '~/lib/utils';
import { Card } from '../ui/card';

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
    <Card
      key={dataId}
      className={cn(
        'border-none p-3 cursor-pointer transition-smooth glass hover:bg-muted/30',
        isActive && 'ring-2 ring-primary/50 bg-linear-to-br from-primary-glow/10 to-primary-foreground'
      )}
      onClick={() => onSelect(dataId)}
    >
      <div className='flex items-center gap-3'>
        <div className='relative'>{leftSection}</div>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between mb-1'>
            <h3 className={cn('font-semibold text-sm truncate', unreadCounts && unreadCounts > 0 && 'text-foreground')}>
              {name}
            </h3>
            <span className='text-xs text-muted-foreground'>{timestamps ? formatOnlineTime(timestamps) : ''}</span>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1 flex-1 min-w-0'>{subTitle}</div>
            <MoreHorizontal className='size-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:size-5 transition-smooth' />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatCard;
