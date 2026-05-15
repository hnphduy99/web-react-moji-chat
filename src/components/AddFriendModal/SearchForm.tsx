import { Search } from 'lucide-react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { IFormValues } from '../chat/AddFriendModal';
import { Button } from '../ui/button';
import { DialogClose, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface SearchFormProps {
  register: UseFormRegister<IFormValues>;
  error: FieldErrors<IFormValues>;
  loading: boolean;
  usernameValue: string;
  isFound: boolean | null;
  searchdUsername: string;
  onSubmit?: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const SearchForm = ({
  register,
  error,
  loading,
  usernameValue,
  isFound,
  searchdUsername,
  onSubmit,
  onCancel
}: SearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='username' className='text-sm font-semibold'>
          Tìm bằng username
        </Label>
        <Input
          id='username'
          placeholder='Gõ username vào đây...'
          className='glass border-border/50 focus:border-primary/50 transition-smooth'
          {...register('username', {
            required: 'Username không được bỏ trống'
          })}
        />
        {error.username && <span className='text-sm text-destructive'>{error.username.message}</span>}

        {isFound === false && (
          <span className='text-sm text-destructive'>
            Không tìm thấy
            <span className='font-semibold'>@{searchdUsername}</span>
          </span>
        )}
      </div>

      <DialogFooter>
        <DialogClose
          nativeButton
          render={
            <Button type='button' variant='outline' className='flex-1 glass hover:text-destructive' onClick={onCancel}>
              Cancel
            </Button>
          }
        />
        <Button
          type='submit'
          disabled={loading || !usernameValue?.trim()}
          className='flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth'
        >
          {loading ? (
            <span>Đang tìm...</span>
          ) : (
            <>
              <Search className='size-4 mr-2' />
              Tìm
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SearchForm;
