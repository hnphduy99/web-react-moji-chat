import * as React from 'react';

import { Eye, EyeOff } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from './button';
import { Input } from './input';

function InputPassword({ className, ...props }: React.ComponentProps<'input'>) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className='relative'>
      <Input type={showPassword ? 'text' : 'password'} className={cn('pr-8', className)} {...props} />
      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='absolute right-1 top-1/2 -translate-y-1/2'
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}

export { InputPassword };
