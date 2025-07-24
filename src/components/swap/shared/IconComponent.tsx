import { Avatar } from 'antd';
import { QuestionOutlined } from '@ant-design/icons';
import { FC } from 'react';

import { StaticImageData } from 'next/image';
import { AvatarSize } from 'antd/es/avatar/AvatarContext';

interface IIconComponent {
  imgUrl?: StaticImageData | string;
  size?: AvatarSize;
}

const IconComponent: FC<IIconComponent> = ({ size, imgUrl }) => {
  console.log('imgUrl:', imgUrl);
  const resolvedSrc = typeof imgUrl === 'object' ? imgUrl.src : imgUrl;

  return (
    <Avatar
      size={size}
      src={resolvedSrc}
      icon={resolvedSrc === 'No Logo' && <QuestionOutlined />}
    />
  );
};
export default IconComponent;

// import { Avatar } from 'antd';
// import { QuestionOutlined } from '@ant-design/icons';
// import { FC } from 'react';

// import Image, { StaticImageData } from 'next/image';
// import { AvatarSize } from 'antd/es/avatar/AvatarContext';

// interface IIconComponent {
//   imgUrl?: StaticImageData | string;
//   size?: AvatarSize;
// }

// const IconComponent: FC<IIconComponent> = ({ size, imgUrl }) => {
//   const resolvedSrc = typeof imgUrl === 'object' ? imgUrl.src : imgUrl;

//   return (
//     <Image
//       src={resolvedSrc || ''}
//       alt="Icon"
//       width={size === 'large' ? 64 : size === 'small' ? 32 : 48}
//       height={size === 'large' ? 64 : size === 'small' ? 32 : 48}
//     />
//   );
// };
// export default IconComponent;
