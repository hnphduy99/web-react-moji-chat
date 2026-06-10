import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { cn, formatOnlineTime } from '~/lib/utils';
import { useChatStore } from '~/stores/useChatStore';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

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
  const { deleteConversation } = useChatStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteConversation(dataId);
    setDeleting(false);
    setShowDeleteDialog(false);
  };

  return (
    <>
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
            <DropdownMenu>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} className='outline-none'>
                <MoreHorizontal className='size-4 text-muted-foreground opacity-0 group-hover/card:opacity-100 hover:text-foreground transition-smooth cursor-pointer' />
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' sideOffset={8} className='w-auto'>
                <DropdownMenuItem
                  variant='destructive'
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                >
                  Xóa cuộc trò chuyện
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa cuộc trò chuyện</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa cuộc trò chuyện với <strong>{name}</strong>? Tất cả tin nhắn sẽ bị xóa vĩnh viễn và
              không thể khôi phục.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowDeleteDialog(false)} disabled={deleting}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatCard;
