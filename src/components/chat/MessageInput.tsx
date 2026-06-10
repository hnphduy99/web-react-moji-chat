import { Input } from '@base-ui/react';
import { ImagePlus, Send, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { getMediaType } from '~/lib/utils';
import { useAuthStore } from '~/stores/useAuthStore';
import { useChatStore } from '~/stores/useChatStore';
import type { Conversation } from '~/types/chat';
import { Button } from '../ui/button';
import EmojiPicker from './EmojiPicker';

const MessageInput = ({ selectedConver }: { selectedConver: Conversation }) => {
  const { user } = useAuthStore();
  const { sendDirectMessage, sendGroupMessage, uploadMessageFile } = useChatStore();
  const [value, setValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgUrl, setImgUrl] = useState('');

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileType = getMediaType(file);
    if (fileType !== 'image') {
      toast.error('Vui lòng chọn ảnh để gửi');
      return;
    }
    if (file.size > 1024 * 1024 * 5) {
      toast.error('File size phải nhỏ hơn 5MB');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    const url = await uploadMessageFile(formData);
    setImgUrl(url);
  };

  if (!user) return;

  const sendMessage = async () => {
    if (!value.trim() && !imgUrl) return;
    const currentValue = value;
    setImgUrl('');
    setValue('');
    try {
      if (selectedConver.type === 'direct') {
        const participants = selectedConver.participants;
        const otherUser = participants.filter((p) => p._id !== user._id)[0];
        await sendDirectMessage(otherUser._id, currentValue, imgUrl);
      } else {
        await sendGroupMessage(selectedConver._id, currentValue, imgUrl);
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi xảy ra khi gửi tin nhắn. Bạn hãy thử lại');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className='flex items-center gap-2 p-3 min-h-14 bg-background'>
      <div>
        <Button onClick={handleClick} size='icon' variant='ghost' className='hover:bg-primary/10 transition-smooth'>
          <ImagePlus className='size-4' />
        </Button>
        <input type='file' hidden accept='image/*' ref={fileInputRef} onChange={handleUpload} />
      </div>

      <div className='flex-1 relative'>
        <Input
          onKeyDown={handleKeyPress}
          placeholder='Soạn tin nhắn'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='pr-10 h-9 w-full outline-none border-border/50 focus:border-primary/50 transition-smooth resize-none'
        />
        <div className='absolute right-2 top-1/2 -translate-y-1/2 transform flex items-center gap-1'>
          {imgUrl && (
            <div className='relative group'>
              <img src={imgUrl} alt='' className='w-10 h-10' />
              <Button
                size='icon-xs'
                onClick={() => setImgUrl('')}
                className='absolute top-1/2 group-hover:opacity-100 opacity-0 transition-all -translate-y-1/2 right-1/2 translate-x-1/2 bg-red-500 text-white rounded-full'
              >
                <X className='size-4' />
              </Button>
            </div>
          )}
          <Button
            render={
              <>
                <EmojiPicker onChange={(emoji: string) => setValue(`${value}${emoji}`)} />
              </>
            }
            nativeButton={false}
            variant='ghost'
            size='icon'
            className='size-8 hover:bg-primary/10 transition-smooth'
          />
        </div>
      </div>
      <Button
        className='bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105'
        disabled={!value.trim() && !imgUrl}
        onClick={sendMessage}
      >
        <Send className='size-4 text-white' />
      </Button>
    </div>
  );
};

export default MessageInput;
