import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useFriendStore } from '~/stores/useFriendStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ReceivedRequest from './ReceivedRequest';
import SendRequest from './SendRequest';

interface FriendRequestDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const FriendRequestDialog = ({ open, setOpen }: FriendRequestDialogProps) => {
  const [tab, setTab] = useState('received');

  const { getAllFriendRequests } = useFriendStore();

  useEffect(() => {
    const loadRequest = async () => {
      try {
        await getAllFriendRequests();
      } catch (error) {
        console.error('Lỗi xảy ra khi getAllFriendRequests', error);
      }
    };
    loadRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Lời mời kết bạn</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab} className='w-full'>
          <TabsList className='w-full grid grid-cols-2'>
            <TabsTrigger value='received'>Đã nhận</TabsTrigger>
            <TabsTrigger value='sent'>Đã gửi</TabsTrigger>
          </TabsList>
          <TabsContent value='received'>
            <ReceivedRequest />
          </TabsContent>
          <TabsContent value='sent'>
            <SendRequest />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FriendRequestDialog;
