const LightningIcon = () => {
  return (
    <div className='w-12 text-primary'>
      <svg fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M13 10V3L4 14h7v7l9-11h-7z'
          strokeDasharray={80}
          strokeDashoffset={80}
        >
          <animate attributeName='stroke-dashoffset' values='80;0;80' dur='1.5s' repeatCount='indefinite' />
        </path>
      </svg>
    </div>
  );
};

export default LightningIcon;
