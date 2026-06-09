import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, Shield, ShieldBan } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { useAuthStore } from '~/stores/useAuthStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { InputPassword } from '../ui/input-password';
import { Label } from '../ui/label';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Xác nhận mật khẩu không khớp',
    path: ['confirmPassword']
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

const PrivacySettings = () => {
  const { changePassword } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema)
  });

  const onSubmit = async (data: ChangePasswordValues) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
    } finally {
      reset();
    }
  };

  const handleCancel = () => {
    reset();
  };

  const items = [
    {
      value: 'changePassword',
      trigger: (
        <>
          <Shield className='h-4 w-4 mr-2' />
          Đổi mật khẩu
        </>
      ),
      content: (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
          {/* Current password */}
          <div className='space-y-1.5'>
            <Label htmlFor='currentPassword' className='text-sm'>
              Mật khẩu hiện tại
            </Label>
            <InputPassword placeholder='Nhập mật khẩu hiện tại' id='currentPassword' {...register('currentPassword')} />
            {errors.currentPassword && <p className='text-destructive text-xs'>{errors.currentPassword.message}</p>}
          </div>

          {/* New password */}
          <div className='space-y-1.5'>
            <Label htmlFor='newPassword' className='text-sm'>
              Mật khẩu mới
            </Label>
            <InputPassword placeholder='Tối thiểu 6 ký tự' id='newPassword' {...register('newPassword')} />
            {errors.newPassword && <p className='text-destructive text-xs'>{errors.newPassword.message}</p>}
          </div>

          {/* Confirm password */}
          <div className='space-y-1.5'>
            <Label htmlFor='confirmPassword' className='text-sm'>
              Xác nhận mật khẩu mới
            </Label>
            <InputPassword
              placeholder='Xác nhận lại mật khẩu mới'
              id='confirmPassword'
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className='text-destructive text-xs'>{errors.confirmPassword.message}</p>}
          </div>

          {/* Actions */}
          <div className='flex gap-2 pt-1'>
            <Button
              type='submit'
              size='sm'
              disabled={isSubmitting}
              className='flex-1 bg-gradient-primary hover:opacity-90 transition-opacity'
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu mật khẩu'}
            </Button>
            <Button type='button' size='sm' variant='outline' onClick={handleCancel} className='flex-1'>
              Huỷ
            </Button>
          </div>
        </form>
      )
    },
    {
      value: 'Notification',
      trigger: (
        <>
          <Bell className='h-4 w-4 mr-2' />
          Cài đặt thông báo
        </>
      ),
      content: <div>Nội dung cài đặt thông báo</div>
    },
    {
      value: 'Report',
      trigger: (
        <>
          <ShieldBan className='h-4 w-4 mr-2' />
          Chặn &amp; Báo cáo
        </>
      ),
      content: <div>Nội dung chặn &amp; báo cáo</div>
    }
  ];

  return (
    <Card className='glass-strong border-border/30'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Shield className='h-5 w-5 text-primary' />
          Quyền riêng tư &amp; Bảo mật
        </CardTitle>
        <CardDescription>Quản lý cài đặt quyền riêng tư và bảo mật của bạn</CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <Accordion className='max-w-lg rounded-lg border'>
          {items.map((item) => (
            <AccordionItem key={item.value} value={item.value} className='px-2'>
              <AccordionTrigger>{item.trigger}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className='pt-4 border-t border-border/30'>
          <h4 className='font-medium mb-3 text-destructive'>Khu vực nguy hiểm</h4>
          <Button variant='destructive' className='w-full'>
            Xoá tài khoản
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
