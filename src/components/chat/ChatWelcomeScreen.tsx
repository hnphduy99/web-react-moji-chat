import { MessageCircle, MessageCircleMore, Users, Zap } from 'lucide-react';
import { SidebarInset } from '../ui/sidebar';
import ChatWindowHeader from './ChatWindowHeader';

const tips = [
  { icon: MessageCircle, label: 'Chat trực tiếp', desc: 'Nhắn tin 1-1 với bạn bè' },
  { icon: Users, label: 'Nhóm chat', desc: 'Trò chuyện với nhiều người' },
  { icon: Zap, label: 'Thời gian thực', desc: 'Tin nhắn được gửi tức thì' }
];

const ChatWelcomeScreen = () => {
  return (
    <SidebarInset className='flex flex-col w-full h-full overflow-hidden'>
      <ChatWindowHeader />
      <div className='flex-1 chat-bg-pattern flex items-center justify-center relative overflow-hidden'>
        {/* Floating orbs */}
        <div className='absolute size-64 rounded-full bg-primary/8 blur-3xl animate-float-orb top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2' />
        <div
          className='absolute size-48 rounded-full bg-pink-400/8 blur-3xl animate-float-orb top-3/4 right-1/4'
          style={{ animationDelay: '2s', animationDuration: '8s' }}
        />
        <div
          className='absolute size-32 rounded-full bg-cyan-400/6 blur-2xl animate-float-orb bottom-1/4 left-1/3'
          style={{ animationDelay: '4s', animationDuration: '10s' }}
        />

        {/* Content */}
        <div className='relative z-10 text-center px-6 max-w-md'>
          {/* Icon */}
          <div className='size-24 mx-auto mb-6 bg-gradient-chat rounded-3xl flex items-center justify-center shadow-glow pulse-ring animate-scale-in rotate-3'>
            <span className='text-4xl'>
              <MessageCircleMore className='text-4xl text-background' />
            </span>
          </div>

          {/* Heading */}
          <h2 className='text-2xl font-bold mb-2 bg-gradient-chat bg-clip-text! text-transparent'>
            Chào mừng bạn đến với Moji!
          </h2>

          <p className='text-muted-foreground mb-8 animate-fade-in-up' style={{ animationDelay: '0.2s' }}>
            Chọn một cuộc hội thoại để bắt đầu trò chuyện
          </p>

          {/* Tips */}
          <div className='grid grid-cols-3 gap-3'>
            {tips.map((tip, i) => (
              <div
                key={tip.label}
                className='p-3 rounded-2xl bg-card/60 border border-border/40 backdrop-blur-sm text-center hover-lift animate-fade-in-up'
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <div className='size-8 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center'>
                  <tip.icon className='size-4 text-primary' />
                </div>
                <p className='text-xs font-semibold text-foreground'>{tip.label}</p>
                <p className='text-xs text-muted-foreground mt-0.5 leading-tight'>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWelcomeScreen;
