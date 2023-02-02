import { Avatar } from "antd";
// import classes from "./IconComponent.module.css";


const IconComponent = (props) => {
    const imgUrl = props.imgUrl
    return (
        // <img style={{ height: '25px', width: '25px', padding: '5px', borderRadius: '50%', border: '1px solid black' }} src={imgUrl} />
        <Avatar size={props.size} src={imgUrl} />
    );
};

export default IconComponent;

// 2nd november | 