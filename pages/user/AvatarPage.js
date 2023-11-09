import dynamic from 'next/dynamic';

const AvatarPage = dynamic(() => import('./Avatar'), {
    ssr: false,
});

export default AvatarPage;
