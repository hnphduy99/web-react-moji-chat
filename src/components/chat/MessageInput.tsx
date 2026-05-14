import { Input } from '@base-ui/react';
import { ImagePlus, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '~/stores/useAuthStore';
import { useChatStore } from '~/stores/useChatStore';
import type { Conversation } from '~/types/chat';
import { Button } from '../ui/button';
import EmojiPicker from './EmojiPicker';

const MessageInput = ({ selectedConver }: { selectedConver: Conversation }) => {
  const { user } = useAuthStore();
  const { sendDirectMessage, sendGroupMessage } = useChatStore();
  const [value, setValue] = useState('');

  if (!user) return;

  const sendMessage = async () => {
    if (!value.trim()) return;
    const currentValue = value;
    setValue('');
    try {
      if (selectedConver.type === 'direct') {
        const participants = selectedConver.participants;
        const otherUser = participants.filter((p) => p._id !== user._id)[0];
        await sendDirectMessage(otherUser._id, currentValue);
      } else {
        await sendGroupMessage(selectedConver._id, currentValue);
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
      <Button variant='ghost' size='icon' className='hover:bg-primary/10 transition-smooth'>
        <ImagePlus className='size-4' />
      </Button>
      <div className='flex-1 relative'>
        <Input
          onKeyDown={handleKeyPress}
          placeholder='Soạn tin nhắn'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='pr-20 h-9 w-full bg-white border-border/50 focus:border-primary/50 transition-smooth resize-none'
        />
        <div className='absolute right-2 top-1/2 -translate-y-1/2 transform flex items-center gap-1'>
          <Button
            render={
              <div>
                <EmojiPicker onChange={(emoji: string) => setValue(`${value}${emoji}`)} />
              </div>
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
        disabled={!value.trim()}
        onClick={sendMessage}
      >
        <Send className='size-4 text-white' />
      </Button>
    </div>
  );
};

export default MessageInput;
