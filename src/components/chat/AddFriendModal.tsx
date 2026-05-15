import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useFriendStore } from '~/stores/useFriendStore';
import type { User } from '~/types/user';
import SearchForm from '../AddFriendModal/SearchForm';
import SendFriendRequestFrom from '../AddFriendModal/SendFriendRequestFrom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

export interface IFormValues {
  message: string;
  username: string;
}

const AddFriendModal = () => {
  const [isFound, setIsFound] = useState<boolean | null>(null);
  const [searchUser, setSearchUser] = useState<User>();
  const [searchedUsername, setSearchedUsername] = useState('');
  const { loading, searchByUsername, addFriend } = useFriendStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm<IFormValues>({
    defaultValues: {
      message: '',
      username: ''
    }
  });

  const usernameValue = useWatch({ control, name: 'username' });

  const handleSearch = handleSubmit(async (data) => {
    const username = data.username.trim();
    if (!username) return;
    setIsFound(null);
    setSearchedUsername(username);
    try {
      const foundUser = await searchByUsername(username);
      if (foundUser) {
        setIsFound(true);
        setSearchUser(foundUser);
      } else {
        setIsFound(false);
      }
    } catch (error) {
      console.error('Lỗi khi tìm user bằng username', error);
      setIsFound(false);
    }
  });

  const handleSend = handleSubmit(async (data) => {
    if (!searchUser) return;
    try {
      const message = await addFriend(searchUser._id, data.message.trim());
      toast.success(message);
      handleCancel();
    } catch (error) {
      console.error('Lỗi khi gửi request từ from', error);
    }
  });

  const handleCancel = () => {
    reset();
    setSearchedUsername('');
    setIsFound(null);
  };

  return (
    <Dialog>
      <DialogTrigger
        nativeButton={false}
        render={
          <div className='flex justify-center items-center size-5 rounded-full hover:bg-sidebar-accent cursor-pointer z-10'>
            <UserPlus className='size-4' />
            <span className='sr-only'>Kết bạn</span>
          </div>
        }
      />
      <DialogContent className='sm:max-w-106.25 border-none'>
        <DialogHeader>
          <DialogTitle>Kết bạn</DialogTitle>
        </DialogHeader>
        {!isFound && (
          <>
            <SearchForm
              register={register}
              error={errors}
              loading={loading}
              usernameValue={usernameValue}
              isFound={isFound}
              searchdUsername={searchedUsername}
              onSubmit={handleSearch}
              onCancel={handleCancel}
            />
          </>
        )}

        {isFound && (
          <>
            <SendFriendRequestFrom
              register={register}
              loading={loading}
              searchdUsername={searchedUsername}
              onSubmit={handleSend}
              onBack={() => setIsFound(null)}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendModal;
