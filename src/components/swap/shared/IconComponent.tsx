import { FC } from 'react';

import Image, { StaticImageData } from 'next/image';

import { Avatar } from 'antd';

interface IIconComponent {
  imgUrl?: StaticImageData | string;
  size?: 'small' | 'large';
}

const SIZE_MAP = {
  small: 24,
  large: 32,
};

const IconComponent: FC<IIconComponent> = ({ size = 'small', imgUrl }) => {
  const resolvedSrc = typeof imgUrl === 'object' ? imgUrl.src : imgUrl;

  const dimensions = SIZE_MAP[size] || 24;

  return (
    <Avatar
      src={
        <Image
          src={resolvedSrc || ''}
          alt="Icon"
          width={dimensions}
          height={dimensions}
        />
      }
      size={size}
    />
  );
};

export default IconComponent;
