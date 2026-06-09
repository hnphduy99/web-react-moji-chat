import { zodResolver } from '@hookform/resolvers/zod';
import { Heart } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { useUserStore } from '~/stores/useUserStore';
import type { User } from '~/types/user';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

type Props = {
  userInfo: User | null;
};

const userInfoSchema = z.object({
  displayName: z.string().min(1, 'Tên hiển thị bắt buộc phải có'),
  email: z.email('Email không hợp lệ'),
  bio: z.string()
});

type UserInfoValues = z.infer<typeof userInfoSchema>;

const PersonalInfoForm = ({ userInfo }: Props) => {
  const { updateUserInfo } = useUserStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<UserInfoValues>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      displayName: userInfo.displayName,
      email: userInfo.email,
      bio: userInfo.bio
    }
  });

  const onSubmit = async (data: UserInfoValues) => {
    await updateUserInfo(data);
  };

  if (!userInfo) return null;

  return (
    <Card className='glass-strong border-border/30'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Heart className='size-5 text-primary' />
          Thông tin cá nhân
        </CardTitle>
        <CardDescription>Cập nhật chi tiết cá nhân và thông tin hồ sơ của bạn</CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-2'>
              <Label htmlFor='displayName' className='block text-sm'>
                Tên hiển thị
              </Label>
              <Input type='text' id='displayName' {...register('displayName')} />

              {errors.displayName && <p className='text-destructive text-sm'>{errors.displayName.message}</p>}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='username' className='block text-sm'>
                Tên người dùng
              </Label>
              <Input type='text' value={userInfo.username} id='username' disabled />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='block text-sm'>
                Email
              </Label>
              <Input type='email' id='email' {...register('email')} />

              {errors.email && <p className='text-destructive text-sm'>{errors.email.message}</p>}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='bio' className='block text-sm'>
              Giới thiệu
            </Label>
            <Textarea id='bio' {...register('bio')} rows={3} className='resize-none' />
            {errors.bio && <p className='text-destructive text-sm'>{errors.bio.message}</p>}
          </div>
          <Button
            type='submit'
            className='w-full md:w-auto bg-gradient-primary hover:opacity-90 transition-opacity'
            disabled={isSubmitting}
          >
            Lưu thay đổi
          </Button>
        </form>
        {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {PERSONAL_FIELDS.map(({ key, label, type }) => (
            <div key={key} className='space-y-2'>
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type={type ?? 'text'}
                value={userInfo[key] ?? ''}
                onChange={() => {}}
                className='glass-light border-border/30'
              />
            </div>
          ))}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='bio'>Giới thiệu</Label>
          <Textarea
            id='bio'
            rows={3}
            value={userInfo.bio ?? ''}
            onChange={() => {}}
            className='glass-light border-border/30 resize-none'
          />
        </div> */}
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
