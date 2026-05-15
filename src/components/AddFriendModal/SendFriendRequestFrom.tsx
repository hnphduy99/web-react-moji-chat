import { UserPlus } from 'lucide-react';
import type { UseFormRegister } from 'react-hook-form';
import type { IFormValues } from '../chat/AddFriendModal';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface SendFriendRequestFromProps {
  register: UseFormRegister<IFormValues>;
  loading: boolean;
  searchdUsername: string;
  onSubmit?: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

const SendFriendRequestFrom = ({
  register,
  loading,
  searchdUsername,
  onSubmit,
  onBack
}: SendFriendRequestFromProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className='space-y-4'>
        <span className='success-message'>
          Tìm thấy <span className='font-semibold'>@{searchdUsername}</span>
        </span>

        <div className='space-y-2'>
          <Label htmlFor='message' className='text-sm font-semibold'>
            Giới thiệu
          </Label>
          <Textarea
            id='message'
            rows={3}
            placeholder='Chào bạn, có thể kết bạn được không'
            className='glass border-border/50 focus:border-primary/50 transition-smooth'
            {...register('message')}
          />
        </div>
        <DialogFooter>
          <Button type='button' variant='outline' className='flex-1 glass hover:text-destructive' onClick={onBack}>
            Quay lại
          </Button>
          <Button
            type='submit'
            disabled={loading}
            className='flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth'
          >
            {loading ? (
              <span>Đang gửi...</span>
            ) : (
              <>
                <UserPlus className='size-4 mr-2' />
                Kết bạn
              </>
            )}
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
};

export default SendFriendRequestFrom;
