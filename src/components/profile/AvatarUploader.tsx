import { Camera } from 'lucide-react';
import { useRef } from 'react';
import { useUserStore } from '~/stores/useUserStore';
import { Button } from '../ui/button';

const AvatarUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateAvatarUrl } = useUserStore();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await updateAvatarUrl(formData);
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        size='icon'
        variant='secondary'
        className='absolute -bottom-2 -right-2 size-9 rounded-full shadow-md hover:scale-115 transition duration-300 hover:bg-background'
      >
        <Camera className='size-4' />
      </Button>
      <input type='file' hidden ref={fileInputRef} onChange={handleUpload} />
    </div>
  );
};

export default AvatarUploader;
