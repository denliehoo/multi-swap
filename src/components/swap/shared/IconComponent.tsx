import { Avatar } from "antd";
import { QuestionOutlined } from "@ant-design/icons";
import { FC } from "react";
import { AvatarSize } from "antd/lib/avatar/SizeContext";

interface IIconComponent {
  imgUrl?: string;
  size?: AvatarSize;
}

const IconComponent: FC<IIconComponent> = ({ size, imgUrl }) => {
  return (
    <Avatar
      size={size}
      src={imgUrl}
      icon={imgUrl === "No Logo" && <QuestionOutlined />}
    />
  );
};
export default IconComponent;
