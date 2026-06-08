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
        <Smile className='size-4 text-muted-foreground' />
      </PopoverTrigger>
      <PopoverContent side='right' className='p-0 border-none ring-0 drop-shadow-none w-full mb-16'>
        <Picker
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
