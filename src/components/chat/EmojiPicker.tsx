import Picker, { Theme } from 'emoji-picker-react';
import { Smile } from 'lucide-react';
import { useThemeStore } from '~/stores/useThemeStore';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface IEmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPicker = ({ onChange }: IEmojiPickerProps) => {
  const { isDark } = useThemeStore();

  return (
    <Popover>
      <PopoverTrigger className='cursor-pointer'>
        <Smile className='size-4' />
      </PopoverTrigger>
      <PopoverContent
        side='right'
        sideOffset={40}
        className='bg-transparent border-none shadow-none drop-shadow-none mb-12'
      >
        <Picker
          className='w-full'
          theme={isDark ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={(emojiObject) => onChange(emojiObject.emoji)}
          lazyLoadEmojis
          previewConfig={{ showPreview: false }}
          skinTonesDisabled
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
