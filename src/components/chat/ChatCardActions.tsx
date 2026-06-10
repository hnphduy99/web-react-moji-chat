import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useChatStore } from '~/stores/useChatStore';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface ChatCardActionsProps {
  conversationId: string;
  name: string;
  conversationType: 'direct' | 'group';
  isGroupLeader: boolean;
}

const ChatCardActions = ({ conversationId, name, conversationType, isGroupLeader }: ChatCardActionsProps) => {
  const { deleteConversation, dissolveGroupChat } = useChatStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDissolveDialog, setShowDissolveDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteConversation(conversationId);
    setLoading(false);
    setShowDeleteDialog(false);
  };

  const handleDissolve = async () => {
    setLoading(true);
    await dissolveGroupChat(conversationId);
    setLoading(false);
    setShowDissolveDialog(false);
  };

  return (
    <>
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
          {conversationType === 'group' && isGroupLeader && (
            <DropdownMenuItem
              variant='destructive'
              onClick={(e) => {
                e.stopPropagation();
                setShowDissolveDialog(true);
              }}
            >
              Giải tán nhóm
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

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
            <Button variant='outline' onClick={() => setShowDeleteDialog(false)} disabled={loading}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDelete} disabled={loading}>
              {loading ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dissolve group confirmation dialog */}
      <Dialog open={showDissolveDialog} onOpenChange={setShowDissolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Giải tán nhóm</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn giải tán nhóm <strong>{name}</strong>? Tất cả tin nhắn và thông tin nhóm sẽ bị xóa vĩnh
              viễn. Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowDissolveDialog(false)} disabled={loading}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDissolve} disabled={loading}>
              {loading ? 'Đang giải tán...' : 'Giải tán'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatCardActions;
